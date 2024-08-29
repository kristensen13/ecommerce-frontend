export interface SubmenuItem {
  title: string;
  icon: string;
  link: string;
}

export interface MenuItem {
  title: string;
  icon: string;
  submenu: SubmenuItem[];
}
