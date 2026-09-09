// @mocha
/**
 * Tests src/providers/componentBrowserVersionLabels.ts — the `tag → short label` map the details panel's version
 * dropdown uses. Both entry points (Component Browser and detached hover) share one message handler, and this is the
 * payload field that used to be sent by only one of them.
 */

import * as assert from 'node:assert/strict';
import { buildVersionLabels } from '../../src/providers/componentBrowserVersionLabels';

suite('buildVersionLabels', () => {
  test('strips the component prefix from each tag for a monorepo source', () => {
    const labels = buildVersionLabels(
      ['deploy-1.0.0', 'deploy-1.1.0'],
      { name: 'deploy', tagPattern: '{name}-{version}' },
    );

    assert.deepStrictEqual(labels, {
      'deploy-1.0.0': '1.0.0',
      'deploy-1.1.0': '1.1.0',
    });
  });

  test('handles a nested tag template', () => {
    const labels = buildVersionLabels(
      ['apps/deploy/v2.3.1'],
      { name: 'deploy', tagPattern: 'apps/{name}/v{version}' },
    );

    assert.deepStrictEqual(labels, { 'apps/deploy/v2.3.1': '2.3.1' });
  });

  test('returns undefined without a tag pattern, so the dropdown shows tags as-is', () => {
    assert.strictEqual(buildVersionLabels(['1.0.0', '1.1.0'], { name: 'deploy' }), undefined);
  });

  test('keeps the full tag as the label when it does not match the pattern', () => {
    const labels = buildVersionLabels(
      ['deploy-1.0.0', 'unrelated-tag'],
      { name: 'deploy', tagPattern: '{name}-{version}' },
    );

    assert.deepStrictEqual(labels, {
      'deploy-1.0.0': '1.0.0',
      'unrelated-tag': 'unrelated-tag',
    });
  });

  test('returns an empty map for a monorepo source with no versions', () => {
    assert.deepStrictEqual(buildVersionLabels([], { name: 'deploy', tagPattern: '{name}-{version}' }), {});
  });
});
