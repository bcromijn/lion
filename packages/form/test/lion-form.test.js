import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy } from 'sinon';

import '@lion/input/lion-input.js';
import '@lion/fieldset/lion-fieldset.js';

import '../lion-form.js';

describe('<lion-form>', () => {
  it('has a custom reset that gets triggered by native reset', async () => {
    const withDefaults = await fixture(html`
      <lion-form
        ><form>
          <lion-input name="firstName" .modelValue="${'Foo'}"></lion-input>
          <input type="reset" value="reset-button" /></form
      ></lion-form>
    `);
    const resetButton = withDefaults.querySelector('input[type=reset]');

    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    withDefaults.reset();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });

    // use button
    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    resetButton.click();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });
  });

  it('dispatches reset events', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <lion-input name="firstName" .modelValue="${'Foo'}"></lion-input>
        </form>
      </lion-form>
    `);

    setTimeout(() => el.reset());
    const resetEv = await oneEvent(el, 'reset');
    expect(resetEv).to.be.instanceOf(Event);
    expect(resetEv.type).to.equal('reset');
    expect(resetEv.target).to.equal(el);
    expect(resetEv.bubbles).to.be.true;
    expect(resetEv.composed).to.be.false;
  });

  it('works with the native submit event (triggered via a button)', async () => {
    const submitSpy = spy();
    const el = await fixture(html`
      <lion-form @submit=${submitSpy}>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);

    const button = el.querySelector('button');
    button.click();
    expect(submitSpy.callCount).to.equal(1);
  });

  it('dispatches submit events', async () => {
    const el = await fixture(html`
      <lion-form>
        <form>
          <button type="submit">submit</button>
        </form>
      </lion-form>
    `);
    const button = el.querySelector('button');
    setTimeout(() => button.click());
    const submitEv = await oneEvent(el, 'submit');
    expect(submitEv).to.be.instanceOf(Event);
    expect(submitEv.type).to.equal('submit');
    expect(submitEv.target).to.equal(el);
    expect(submitEv.bubbles).to.be.true;
    expect(submitEv.composed).to.be.false;
  });
});
