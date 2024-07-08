class MyComponent extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                .container {
                    border: 2px solid #000;
                    padding: 10px;
                    border-radius: 5px;
                    width: 300px;
                }
                ::slotted(h1) {
                    color: blue;
                }
                ::slotted(p) {
                    color: green;
                }
            </style>
            <div class="container">
                <slot name="title"></slot>
                <slot name="content"></slot>
            </div>
        `;
    }
}

customElements.define('my-component', MyComponent);
