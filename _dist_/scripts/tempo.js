export default function Tempo () {
  const input = document.getElementById('BPM')
  const value = input.value ? input.value : input
  return (60 / parseInt(value))
}
