export const setActiveSidebarItem = (itemName: string, active: string) => {
  const sidebarItems = Array.from(
    document.querySelectorAll(".c-sidebar-item")
  ).filter((item) => item.textContent == itemName);
  if (sidebarItems.length == 0) return;

  const quickSSRFItem = sidebarItems[0] as HTMLElement;
  quickSSRFItem.setAttribute("data-is-active", active);
};
