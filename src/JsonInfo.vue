<template>
<div class="px-md-5 py-3">
  <h1>Make it readable!</h1>
  <p>This tool formats JSON (and XML) for human readability only.</p>
  <p>
    Please do not use this tool for use cases where precision is critical.
    It parses and re-renders the input and will often <em>not</em> produce a 1:1 copy.
  </p>
  <p>Examples:</p>
  <ul>
    <li>JSON: <code>0.00</code> becomes <code>0</code></li>
    <li>JSON: <code>0.0000001</code> becomes <code>1e-7</code></li>
    <li>XML: leading and trailing whitespace will be <strong>ignored</strong></li>
    <li>XML: empty nodes will be <strong>self-closed</strong></li>
    <li>XML: internal DTDs in !DOCTYPE will be <strong>ignored</strong></li>
  </ul>
</div>
</template>