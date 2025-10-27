import { html, fixture, expect } from '@open-wc/testing';
import "../my-element.js";

describe("MyElement test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <my-element
        title="title"
      ></my-element>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
