/**
 * Markdown → HTML (book Ch. 2): visitor pattern + chain of responsibility.
 * Supports # / ## / ### headers, --- horizontal rules, and paragraphs.
 */

enum TagType {
  Paragraph,
  Header1,
  Header2,
  Header3,
  HorizontalRule,
}

class TagTypeToHtml {
  private readonly tagType = new Map<TagType, string>();

  constructor() {
    this.tagType.set(TagType.Header1, "h1");
    this.tagType.set(TagType.Header2, "h2");
    this.tagType.set(TagType.Header3, "h3");
    this.tagType.set(TagType.Paragraph, "p");
    this.tagType.set(TagType.HorizontalRule, "hr");
  }

  openingTag(tagType: TagType): string {
    return this.getTag(tagType, "<");
  }

  closingTag(tagType: TagType): string {
    return this.getTag(tagType, "</");
  }

  private getTag(tagType: TagType, openingTagPattern: string): string {
    const tag = this.tagType.get(tagType);
    if (tag !== undefined) {
      return `${openingTagPattern}${tag}>`;
    }
    return `${openingTagPattern}p>`;
  }
}

interface IMarkdownDocument {
  add(...content: string[]): void;
  get(): string;
}

class MarkdownDocument implements IMarkdownDocument {
  private content = "";

  add(...content: string[]): void {
    content.forEach((element) => {
      this.content += element;
    });
  }

  get(): string {
    return this.content;
  }
}

class LineParser {
  parse(value: string, tag: string): [boolean, string] {
    const output: [boolean, string] = [false, ""];
    output[1] = value;
    if (value === "") {
      return output;
    }
    const split = value.startsWith(tag);
    if (split) {
      output[0] = true;
      output[1] = value.slice(tag.length);
    }
    return output;
  }
}

class ParseElement {
  currentLine = "";
}

interface IVisitor {
  visit(token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

interface IVisitable {
  accept(
    visitor: IVisitor,
    token: ParseElement,
    markdownDocument: IMarkdownDocument,
  ): void;
}

class Visitable implements IVisitable {
  accept(
    visitor: IVisitor,
    token: ParseElement,
    markdownDocument: IMarkdownDocument,
  ): void {
    visitor.visit(token, markdownDocument);
  }
}

abstract class VisitorBase implements IVisitor {
  constructor(
    private readonly tagType: TagType,
    private readonly tagTypeToHtml: TagTypeToHtml,
  ) {}

  visit(token: ParseElement, markdownDocument: IMarkdownDocument): void {
    markdownDocument.add(
      this.tagTypeToHtml.openingTag(this.tagType),
      token.currentLine,
      this.tagTypeToHtml.closingTag(this.tagType),
    );
  }
}

abstract class Handler {
  protected next: Handler | null = null;

  setNext(next: Handler): void {
    this.next = next;
  }

  handleRequest(request: ParseElement): void {
    if (!this.canHandle(request)) {
      if (this.next != null) {
        this.next.handleRequest(request);
      }
    }
  }

  protected abstract canHandle(request: ParseElement): boolean;
}

class ParseChainHandler extends Handler {
  private readonly visitable: IVisitable = new Visitable();

  protected canHandle(request: ParseElement): boolean {
    const split = new LineParser().parse(request.currentLine, this.tagType);
    if (split[0]) {
      request.currentLine = split[1];
      this.visitable.accept(this.visitor, request, this.document);
    }
    return split[0];
  }

  constructor(
    private readonly document: IMarkdownDocument,
    private readonly tagType: string,
    private readonly visitor: IVisitor,
  ) {
    super();
  }
}

class Header1Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header1, new TagTypeToHtml());
  }
}

class Header2Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header2, new TagTypeToHtml());
  }
}

class Header3Visitor extends VisitorBase {
  constructor() {
    super(TagType.Header3, new TagTypeToHtml());
  }
}

class ParagraphVisitor extends VisitorBase {
  constructor() {
    super(TagType.Paragraph, new TagTypeToHtml());
  }
}

class HorizontalRuleVisitor extends VisitorBase {
  constructor() {
    super(TagType.HorizontalRule, new TagTypeToHtml());
  }
}

class Header1ChainHandler extends ParseChainHandler {
  constructor(document: IMarkdownDocument) {
    super(document, "# ", new Header1Visitor());
  }
}

class Header2ChainHandler extends ParseChainHandler {
  constructor(document: IMarkdownDocument) {
    super(document, "## ", new Header2Visitor());
  }
}

class Header3ChainHandler extends ParseChainHandler {
  constructor(document: IMarkdownDocument) {
    super(document, "### ", new Header3Visitor());
  }
}

class HorizontalRuleHandler extends ParseChainHandler {
  constructor(document: IMarkdownDocument) {
    super(document, "---", new HorizontalRuleVisitor());
  }
}

class ParagraphHandler extends Handler {
  private readonly visitable: IVisitable = new Visitable();
  private readonly visitor: IVisitor = new ParagraphVisitor();

  protected canHandle(request: ParseElement): boolean {
    this.visitable.accept(this.visitor, request, this.document);
    return true;
  }

  constructor(private readonly document: IMarkdownDocument) {
    super();
  }
}

class ChainOfResponsibilityFactory {
  build(document: IMarkdownDocument): ParseChainHandler {
    const header1 = new Header1ChainHandler(document);
    const header2 = new Header2ChainHandler(document);
    const header3 = new Header3ChainHandler(document);
    const horizontalRule = new HorizontalRuleHandler(document);
    const paragraph = new ParagraphHandler(document);

    header1.setNext(header2);
    header2.setNext(header3);
    header3.setNext(horizontalRule);
    horizontalRule.setNext(paragraph);

    return header1;
  }
}

class Markdown {
  toHtml(text: string): string {
    const document: IMarkdownDocument = new MarkdownDocument();
    const chain = new ChainOfResponsibilityFactory().build(document);
    const lines = text.split("\n");
    for (let index = 0; index < lines.length; index++) {
      const parseElement = new ParseElement();
      parseElement.currentLine = lines[index];
      chain.handleRequest(parseElement);
    }
    return document.get();
  }
}

const converter = new Markdown();

export function markdownToHtml(text: string): string {
  if (!text.trim()) {
    return "";
  }
  return converter.toHtml(text);
}
