export function DemoHelpSection() {
  return (
    <section className="md-help" aria-labelledby="help-heading">
      <h2 id="help-heading">Help</h2>
      <h3>About this app</h3>
      <p>
        A live markdown editor with a custom parser written in TypeScript. Each line
        is classified using a <strong>chain of responsibility</strong>, then converted
        to HTML with the <strong>visitor</strong> pattern.
      </p>
      <h3>Syntax supported</h3>
      <ul>
        <li>
          <code># </code> heading level 1, <code>## </code> level 2,{" "}
          <code>### </code> level 3
        </li>
        <li>
          <code>---</code> horizontal rule
        </li>
        <li>Any other non-empty line becomes a paragraph</li>
      </ul>
      <h3>How to use it</h3>
      <ol>
        <li>Edit markdown in the left panel.</li>
        <li>Read the rendered HTML preview on the right as you type.</li>
        <li>Use <strong>Reset sample</strong> to restore the starter document.</li>
      </ol>
    </section>
  );
}
