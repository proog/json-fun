<template>
<div class="h-100 flex flex-column">
  <div class="h-100 pa3 overflow-auto">
    <h1>Make it readable!</h1>
    <p>This tool formats JSON (and XML) for human readability only.</p>
    <p>
      Don't use this tool for use cases where precision is critical.
      It parses and re-renders the input and will often <em>not</em> produce a 1:1 copy.
    </p>
    <p>Examples:</p>
    <ul>
      <li>JSON: <code>0.00</code> becomes <code>0</code></li>
      <li>JSON: <code>0.0000001</code> becomes <code>1e-7</code></li>
      <li>XML: leading and trailing whitespace will be <em>ignored</em></li>
      <li>XML: empty nodes will be <em>self-closed</em></li>
      <li>XML: internal DTDs in !DOCTYPE will be <em>ignored</em></li>
    </ul>
  </div>
  <div class="mt2 tc">
    A project by <a class="link underline-hover obsidian-orange" href="https://permortensen.com">Per</a>
  </div>
</div>
</template>