import { TestComponent } from './components/test_component'

class App {
  constructor() {
    this.init(document.querySelector('[test-component]'), TestComponent, {class: 'is-custom-test'})
  }

  init(element, component, options) {
    if (element) {
      return new component(element, options)
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  $(document).foundation()
  svg4everybody()

  new App()
})
