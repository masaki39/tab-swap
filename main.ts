import { Plugin, type WorkspaceLeaf } from 'obsidian';
type TabGroup = { children: WorkspaceLeaf[]; recomputeChildrenDimensions: () => void; };
export default class TabSwap extends Plugin {
	onload(): void {
		this.addCommand({ id: 'swap-tab-left', name: 'Swap tab left', repeatable: true, callback: () => void this.swapTab(-1) });
		this.addCommand({ id: 'swap-tab-right', name: 'Swap tab right', repeatable: true, callback: () => void this.swapTab(1) });
	}
	private async swapTab(direction: -1 | 1): Promise<void> {
		const activeLeaf = this.app.workspace.getMostRecentLeaf();
		if (!activeLeaf) return;
		const tabGroup = activeLeaf.parent as unknown as TabGroup | null;
		if (!tabGroup?.children?.length || typeof tabGroup.recomputeChildrenDimensions !== 'function') return;
		const tabList = tabGroup.children;
		const activeTabIndex = tabList.indexOf(activeLeaf);
		const activeTabNewIndex = activeTabIndex + direction;
		if (activeTabIndex === -1 || activeTabNewIndex < 0 || activeTabNewIndex >= tabList.length) return;
		[tabList[activeTabIndex], tabList[activeTabNewIndex]] = [tabList[activeTabNewIndex], tabList[activeTabIndex]];
		tabGroup.recomputeChildrenDimensions();
		await this.app.workspace.revealLeaf(tabList[activeTabNewIndex]);
	}
}