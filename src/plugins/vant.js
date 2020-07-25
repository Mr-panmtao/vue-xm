import Vue from 'vue'
import {
  Tabbar,
  TabbarItem,
  Field,
  Search,
  Swipe,
  SwipeItem,
  Lazyload,
  Icon,
  Grid,
  GridItem,
  Image as VanImage,
  CountDown,
  NavBar,
  Sidebar,
  SidebarItem,
  List,
  Toast,
  GoodsAction, GoodsActionIcon, GoodsActionButton,
  Sku,
  Dialog,
  Notify,
  Divider,
  Empty,
  Cell, CellGroup,
  Tag,
  Button,
  Tab, Tabs,
  Form,
  NoticeBar,
  PullRefresh,
  ImagePreview,
  ActionSheet,
  DatetimePicker,
  CouponCell, CouponList,
  AddressEdit,
  AddressList,
  Overlay,
  ContactCard, ContactList, ContactEdit,
  SubmitBar,
  PasswordInput, NumberKeyboard,
  Step, Steps,
  Skeleton
} from 'vant'

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
})

Vue.use(Tabbar)
Vue.use(Skeleton)
Vue.use(Step)
Vue.use(Steps)
Vue.use(PasswordInput)
Vue.use(NumberKeyboard)
Vue.use(SubmitBar)
Vue.use(ContactCard)
Vue.use(ContactList)
Vue.use(ContactEdit)
Vue.use(TabbarItem)
Vue.use(Field)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(VanImage)
Vue.use(CountDown)
Vue.use(NavBar)
Vue.use(Sidebar)
Vue.use(List)
Vue.use(SidebarItem)
Vue.use(Toast)
Vue.use(GoodsAction)
Vue.use(GoodsActionIcon)
Vue.use(GoodsActionButton)
Vue.use(Sku)
Vue.use(Dialog)
Vue.use(Notify)
Vue.use(Divider)
Vue.use(Empty)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Form)
Vue.use(NoticeBar)
Vue.use(PullRefresh)
Vue.use(ImagePreview)
Vue.use(ActionSheet)
Vue.use(DatetimePicker)
Vue.use(CouponCell)
Vue.use(CouponList)
Vue.use(AddressEdit)
Vue.use(AddressList)
Vue.use(Overlay)

Vue.prototype.$msg = Toast
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Notify = Notify
Vue.prototype.ImagePreview = ImagePreview

// 将所有 Toast 的展示时长设置为 2000 毫秒
Toast.setDefaultOptions({ duration: 2000 })

// 将所有 loading Toast 设置为背景不可点击
Toast.setDefaultOptions('loading', { forbidClick: true })
