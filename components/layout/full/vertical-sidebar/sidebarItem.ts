import {
  CopyIcon,
  LayoutDashboardIcon,
  TypographyIcon,
} from 'vue-tabler-icons';

export interface Menu {
  key?: string;
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: Menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: { header: string, childs: Menu[] }[] = [{
  header: 'Production',
  childs: [{
    key: 'job-plan',
    title: 'สร้างงาน',
    icon: LayoutDashboardIcon,
    to: '/job-plan'
  },{
    key: 'cad',
    title: 'ออกแบบงาน',
    icon: LayoutDashboardIcon,
    to: '/cad'
  },],
},{
  header: 'Schedule',
  childs: [{
    key: 'schedule',
    title: 'เวลาการทำงาน',
    icon: TypographyIcon,
    to: '/schedule'
  },{
    key: 'ot',
    title: 'ทำงานล่วงเวลา',
    icon: CopyIcon,
    to: '/ot'
  },],
},{
  header: 'Master Data',
  childs: [{
    key: 'process',
    title: 'โปรเซทงาน',
    icon: CopyIcon,
    to: '/process'
  },{
    key: 'process-title',
    title: 'คุณสมบัติ',
    icon: CopyIcon,
    to: '/process-title'
  },{
    key: 'machine',
    title: 'เครื่องจักร',
    icon: CopyIcon,
    to: '/machine'
  },{
    key: 'job-type',
    title: 'ประเภทงาน',
    icon: CopyIcon,
    to: '/job-type'
  },],
},{
  header: 'Users',
  childs: [{
    key: 'user',
    title: 'ผู้ใช้งานระบบ',
    icon: CopyIcon,
    to: '/user'
  },{ 
    key: 'license',
    title: 'สิทธิ์การใช้งาน',
    icon: CopyIcon,
    to: '/license'
  },{
    key: 'department',
    title: 'เเผนก',
    icon: CopyIcon,
    to: '/department'
  },{
    key: 'user_position',
    title: 'ตำเเหน่ง',
    icon: CopyIcon,
    to: '/user-position'
  }],
}];

export default sidebarItem