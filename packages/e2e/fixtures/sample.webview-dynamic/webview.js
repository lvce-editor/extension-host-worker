const button = document.createElement('button')
button.textContent = '0'

document.body.append(button)

const rpc = globalThis.lvceRpc({
  commands: {
    setButtonText(text) {
      // @ts-ignore
      button.textContent = text
    },
  },
})

const handleClick = async () => {
  await rpc.invoke('handleClick')
}

button?.addEventListener('click', handleClick)
