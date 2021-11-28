// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "input::-webkit-outer-spin-button,\ninput::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\n/* Firefox */\n\ninput[type=number] {\n  -moz-appearance: textfield;\n}\n\n.incrementer {\n  display: flex;\n  height: 2rem;\n  width: 2rem;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.125rem;\n  border-width: 1px;\n  border-color: var(--text-color);\n  background-color: var(--bkg-color);\n  padding: 0px;\n  color: var(--text-color);\n}\n\n.incrementer:active {\n  background-color: var(--text-color);\n  color: var(--bkg-color);\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}