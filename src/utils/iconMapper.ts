import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import TouchApp from '@mui/icons-material/TouchApp';
import StoreIcon from '@mui/icons-material/Store';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import AlarmIcon from '@mui/icons-material/Alarm';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import {
  ShoppingCart, ScanBarcode, LayoutDashboard, Activity, AlertCircle, Timer, CalendarRange,
  Users, Smile, Unlock, BarChart4, Store, UserCheck, FileSearch, TrendingUp, CalendarClock, LogIn, LogOut,
  Wallet, ArrowDownCircle, Inbox, ClipboardList, Receipt, CreditCard, PencilLine, Image, PlaySquare, Megaphone, SlidersHorizontal,
  Monitor, FolderTree, XCircle, Keyboard, Percent, Search, AreaChart, HelpCircle, Ban, PackageCheck, FileText, FileBarChart,
  ShieldCheck, BarChart2, PanelTop, Shield, Package, PackageSearch, UsersRound, PackagePlus, Network, Clock3,
  GitPullRequestCreateArrow, NotebookPen, Factory, LayoutGrid, Folder, List, PhoneForwarded, SquareX, AlarmClockPlus,
  FileQuestionIcon, Clock, History, Building2, Map, UserCog, Settings, Grid3x3,ClipboardCheck,Wrench,Truck, AlertTriangle,ShieldAlert,Forklift,Cctv,MonitorPlay,
  Camera, Video, Webcam,GitCompare,BadgeCheck,Kanban

} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  QrCodeScannerIcon,
  ErrorOutlineOutlinedIcon,
  PointOfSaleOutlinedIcon,
  PermIdentityOutlinedIcon,
  AddShoppingCartOutlinedIcon,
  TouchApp,
  StoreIcon,
  CalendarMonth,
  CampaignIcon,
  AlarmIcon,
  ShoppingCartCheckoutIcon,
  HomeOutlinedIcon,
  ShoppingCart,
  ScanBarcode,
  LayoutDashboard,
  Activity,
  AlertCircle,
  Timer,
  CalendarRange,
  Users,
  Smile,
  Unlock,
  BarChart4,
  Store,
  UserCheck,
  FileSearch,
  TrendingUp,
  CalendarClock,
  LogIn,
  LogOut,
  Wallet, ArrowDownCircle, Inbox, ClipboardList,
  Receipt, CreditCard,
  PencilLine, Image, PlaySquare, Megaphone, SlidersHorizontal, Monitor, FolderTree,
  XCircle, Keyboard, Percent, Search, AreaChart, HelpCircle, Ban, PackageCheck, FileText, FileBarChart,
  ShieldCheck, BarChart2, PanelTop, Shield, Package,
  PackageSearch, UsersRound, PackagePlus, Network, Clock3, GitPullRequestCreateArrow, NotebookPen,
  Factory, LayoutGrid, Folder, List, PhoneForwarded, SquareX, AlarmClockPlus, FileQuestionIcon,
  Clock, History, Building2, Map, UserCog, Settings, Grid3x3,
  ClipboardCheck,Wrench,Truck,AlertTriangle,ShieldAlert,Forklift,Cctv,MonitorPlay,
  Camera, Video, Webcam,GitCompare,BadgeCheck,Kanban
};

export function getIconComponent(name: string): React.ElementType {
  return iconMap[name] || HomeOutlinedIcon;
}
