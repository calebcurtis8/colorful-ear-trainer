export function removeClassStartsWith (node, className) {
  [...node.classList].forEach(v => {
    if (v.startsWith(className)) {
      node.classList.remove(v)
    }
  })
}
