const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { createContext } = require('@dprint/formatter');
const {
  formatContentAsync,
  repairSplitInterpolationTrim,
} = require('../src/formatter');

function hasDetachedInterpolationTrim(text) {
  return /\{\{(?:[ \t]*\n)?[ \t]+-/.test(text) || /-[ \t]+(?:\n[ \t]*)?\}\}/.test(text);
}

describe('repairSplitInterpolationTrim', () => {
  it('reattaches spaces around trim dashes', () => {
    expect(repairSplitInterpolationTrim('{{ - name - }}')).to.equal('{{- name -}}');
  });

  it('reattaches trim dashes split onto their own lines', () => {
    const input = `{{\n  - name -\n}}`;
    expect(repairSplitInterpolationTrim(input)).to.equal('{{- name -}}');
  });

  it('reattaches dashes that were placed on their own lines', () => {
    const input = `{{\n    -\nfoo\n   -\n}}`;
    expect(repairSplitInterpolationTrim(input)).to.equal('{{- foo -}}');
  });

  it('leaves already-valid trim markers unchanged', () => {
    expect(repairSplitInterpolationTrim('{{- name -}}')).to.equal('{{- name -}}');
  });

  it('leaves dprint-wrapped trim interpolations unchanged', () => {
    const valid = '{{-\n  govukButton({ text: "Submit" })\n-}}';
    expect(repairSplitInterpolationTrim(valid)).to.equal(valid);
  });

  it('does not treat unary minus as a trim marker', () => {
    expect(repairSplitInterpolationTrim('{{ -5 }}')).to.equal('{{ -5 }}');
    expect(repairSplitInterpolationTrim('{{ -name }}')).to.equal('{{ -name }}');
  });

  it('does not rewrite subtraction expressions', () => {
    expect(repairSplitInterpolationTrim('{{ foo - bar }}')).to.equal('{{ foo - bar }}');
  });
});

describe('dprint nunjucks whitespace control', () => {
  let formatNjk;

  before(() => {
    const context = createContext({ indentWidth: 2 });
    const wasmPath = path.join(__dirname, '..', 'node_modules', 'dprint-plugin-markup', 'plugin.wasm');
    context.addPlugin(fs.readFileSync(wasmPath), {});
    formatNjk = (content) =>
      formatContentAsync(content, 'file.njk', (text, filePath) =>
        context.formatText({ filePath, fileText: text })
      );
  });

  it('keeps {{- and -}} attached on short interpolations', async () => {
    const out = await formatNjk('<p>{{- name -}}</p>');
    expect(out).to.include('{{- name -}}');
    expect(hasDetachedInterpolationTrim(out)).to.equal(false);
  });

  it('keeps {{- and -}} attached when the interpolation wraps', async () => {
    const input =
      '{{- govukButton({ text: "Submit form", classes: "govuk-button--primary", attributes: { "data-module": "govuk-button" } }) -}}';
    const out = await formatNjk(input);
    expect(out).to.match(/\{\{-/);
    expect(out).to.match(/-\}\}/);
    expect(hasDetachedInterpolationTrim(out)).to.equal(false);
  });

  it('preserves {%- block trim -%}', async () => {
    const out = await formatNjk('{%- if true -%}ok{%- endif -%}');
    expect(out).to.include('{%- if true -%}');
    expect(out).to.include('{%- endif -%}');
  });

  it('repairs interpolations already broken by v0.0.5', async () => {
    const out = await formatNjk('<p>{{ - name - }}</p>');
    expect(out).to.include('{{- name -}}');
    expect(hasDetachedInterpolationTrim(out)).to.equal(false);
  });
});
