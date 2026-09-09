/**
 * Pure helper for the details panel's version dropdown labelling.
 *
 * `vscode`-free so the unit suite can drive it directly; the panel's message handler is otherwise unreachable
 * outside the extension host.
 */

import { stripTagPrefix } from '../services/component/tagScoping';

/**
 * Map each full tag to its stripped `{version}` for a tag-per-component monorepo, so the dropdown shows short labels
 * while keeping the full tag as the option value (the ref that actually gets inserted).
 *
 * @param versions  The tags returned for the component, in display order.
 * @param component Its name, and the source's tag template if it is a monorepo.
 * @returns         A `tag → label` map, or `undefined` for an ordinary source where the value already is the label.
 */
export function buildVersionLabels(
  versions: string[],
  component: { name: string; tagPattern?: string }
): Record<string, string> | undefined {
  if (!component.tagPattern) {
    return undefined;
  }

  const labels: Record<string, string> = {};
  for (const version of versions) {
    labels[version] = stripTagPrefix(version, component.name, component.tagPattern);
  }
  return labels;
}
