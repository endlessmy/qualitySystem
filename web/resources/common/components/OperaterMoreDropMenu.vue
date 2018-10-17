<template>
    <div class="dropdown">
        <el-popover
            v-dropdownMouseleaveHide
            ref="dropdownpopover"
            popper-class="operater-dropdown-menu"
            placement="bottom"
            trigger="click">
            <slot name="listmenu"></slot>
        </el-popover>
        <span
            v-popover:dropdownpopover
            class="dropdown-link">
            <i
                ref="iconMore"
                class="icon-more"
                title="更多操作"></i>
        </span>
    </div>
</template>

<script>
export default {
    name: 'OperaterMoreDropMenu',
    directives: {
        dropdownMouseleaveHide: {
            bind(elm, binding, vm) {
                let thisRow, thisPopper, thisIconMore;
                const findRow = element => {
                    if (!element) {
                        return false;
                    }
                    return element.nodeName === 'TR' ? element : findRow(element.parentNode);
                };
                vm.componentInstance.$nextTick(() => {
                    thisRow = findRow(elm);
                    thisPopper = vm.componentInstance.$refs.popper;
                    thisIconMore = vm.componentInstance.$refs.reference.getElementsByTagName('i')[0];
                    // prevent mouse leave hide menu
                    elm.querySelector('ul').setAttribute('preventMouseLeave', '');
                    vm.componentInstance.$on('show', () => {
                        thisRow.classList.add('show-operate');
                        document.addEventListener('click', hideIconMore, false);
                    });
                });
                // 点击页面其它位置更多按钮消失，并注销事件
                function hideIconMore(evte) {
                    if (evte.target === thisIconMore) {
                        !vm.componentInstance.showPopper && thisRow.classList.remove('show-operate');
                    } else {
                        vm.componentInstance.showPopper = false;
                        thisRow.classList.remove('show-operate');
                        document.removeEventListener('click', hideIconMore, false);
                    }
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../layouts/css/themes/default.less';
.dropdown {
    position: relative;
    .dropdown-link {
        position: relative;
        i.icon-shezhi1 {
            font-size: 15px;
        }
    }
}
</style>

<style lang="less">
@import '../layouts/css/themes/default.less';
.operater-dropdown-menu {
    background: none !important;
    padding: 0px !important;
    border: 0px !important;
    .popper__arrow {
        display: none !important;
    }
    ul {
        position: relative;
        cursor: pointer;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
        border-radius: 2px;
        > li {
            height: 39px;
            width: 100px;
            line-height: 39px;
            background-color: #fff;
            text-align: center;
            color: @text-color11;
            border-radius: 2px;

            &:hover {
                background: @background-color4;
            }
        }
    }
}
</style>
