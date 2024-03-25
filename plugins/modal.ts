export default defineNuxtPlugin((context) => {
  const showModal = (modalId: string) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = 'block'
      setTimeout(() => {
        modal.style.opacity = '1'
      }, 100)
    }
  }
  const hiddenModal = (modalId: string) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.opacity = '0'
      setTimeout(() => {
        modal.style.display = 'none'
      }, 100)
    }
  }
  return {
    provide: {
      showModal,
      hiddenModal,
    },
  }
})
