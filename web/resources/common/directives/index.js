import Vue from 'vue';

Vue.directive('removeSearchQuery', {
    bind(elm, binding, vm) {
        vm.componentInstance.$on('change', () => vm.componentInstance.query = '');
    }
});

Vue.directive('selectPopperWidth', {
    inserted(el, binding, vm) {
        setTimeout(() => {
            let popperClass = binding.arg;
            let cusWidth = binding.value;
            let elWidth = el.offsetWidth;
            if (!popperClass) return;
            el.addEventListener('click', setPopperWidth);
            function setPopperWidth() {
                try {
                    let popper = document.querySelector(`.${popperClass}`);
                    const calcu = cusWidth || elWidth;
                    popper.style.maxWidth = `${calcu}px`;
                    popper = null;
                } catch (e) {
                }
            };
        });
    }
});
// @author dengyingfeng 2018/03/27;
/*
	背景：联动选择（cascader）下拉popper位置可能移除视口外。
	使用：调用该指令需指定参数 如:'v-setCascaderPopperPos:versionPopper',
		  cascader组件需给定'popper-class'属性，其值与指令参数相同如:'popper-class=versionPopper'
*/
Vue.directive('setCascaderPopperPos', {
    inserted(el, binding, vm) {
        el.addEventListener('click', (e) => {
            document.body.style.overflowX = 'hidden';
        });
        vm.componentInstance.$on('change', () => {
            setTimeout(() => {
                try {
                    let popperClass = binding.arg;
                    let cusWidth = binding.value;
                    let elWidth = el.offsetWidth;
                    if (!popperClass) return;
                    var pageWidth = window.innerWidth;
				    if (typeof pageWidth !== 'number') {
				        if (document.compactMode == 'CSS1Compat') {
				            pageWidth = document.documentElement.clientWidth;
				        } else {
				            pageWidth = document.body.clientWidth;
				        }
				    }
                    let popperList = document.querySelectorAll(`.${popperClass}`);
                    let popper;
                    for (let i = 0; i < popperList.length; i++) {
                        if (popperList[i].style.display !== 'none') {
                            popper = popperList[i];
                            break;
                        }
                    }
                    if (!popper) return;
                    let elPos = el.getBoundingClientRect();
                    let popperPos = popper.getBoundingClientRect();
                    let leftVal = parseInt(popper.style.left);
                    let options = vm.componentInstance.options;
                    let curValArr = vm.componentInstance.currentValue;
                    let curVal = curValArr[curValArr.length - 1].toString().split(',')[0];
                    let childrenKey = vm.componentInstance.childrenKey;
                    let _hasChildren = (val, opt = [], has = false) => {
                        opt.forEach(item => {
                            let val = (item.value + '').split(',')[0];
                            let hasChildren = Array.isArray(item[childrenKey]) && item[childrenKey].length;
                            if (val === curVal) {
                                has = true;
                            } else {
                                if (hasChildren) {
                                    _hasChildren(val, item[childrenKey], has);
                                }
                            }
                        });
                        return has;
                    };
                    if (!_hasChildren(curVal, options)) {
                        document.body.style.overflowX = 'initial';
                    }
                    if (popperPos.right > pageWidth) {
                        popper.style.left = leftVal - (popperPos.right - elPos.right) + 'px';
                    } else {
                        popper.style.left = elPos.lfet + 'px';
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
});

Vue.directive('borderTableResize', {
    bind(elm, binding, vm) {
        vm.componentInstance.$nextTick(() => {
            const container = document.querySelector('.el-tabs__content') ? document.querySelector('.el-tabs__content') : elm.parentNode;
            if (!container) {
                return false;
            }
            const tableHeader = elm.querySelector('.el-table__header');
            const headerWrapper = elm.querySelector('.el-table__header-wrapper');
            const bodyWrapper = elm.querySelector('.el-table__body-wrapper');
            const tableHeaderItem = tableHeader.querySelector('thead>tr').childNodes;
            let allCols = elm.querySelectorAll('col');
            const lastColName = allCols[allCols.length - 1].attributes.name.value;
            const lastColMinWidth = parseInt(allCols[allCols.length - 1].attributes.width.value);
            const dragLineHelper = document.createElement('span');
            dragLineHelper.setAttribute('draggable-helper', '');
            let leftSpace = elm.getBoundingClientRect().left;
            let scrollLeftOffset = 0;
            const containerWidth = container.clientWidth;

            // 设置添加css属性
            let draggableMinHeight = tableHeader.clientHeight || 46; // ie 兼容修复
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `span[draggable-cell] { position:absolute;right:0px;top:0px;display:block;height:100%;min-height:${draggableMinHeight}px;width:5px;border-right:1px solid #ECEDEE; cursor: col-resize;}
							span[draggable-helper]{position:absolute;display:none;width:1px;height:100%;top:0px;left:0px;background:rgba(0,0,0,0.1)}
							.noselect{user-select: none;  -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}`;
            document.head.appendChild(style);

            headerWrapper.style.overflow = tableHeader.clientWidth >= containerWidth ? 'visible' : 'initial';
            bodyWrapper.style.overflow = tableHeader.clientWidth >= containerWidth ? 'visible' : 'initial';
            container.style.overflowX = tableHeader.clientWidth >= containerWidth && tableHeader.clientWidth !== 0 ? 'scroll' : 'initial';
            container.style.width = '100%';

            let ua = navigator.userAgent;
            let ie = ua.indexOf('Trident/') != -1 || ua.indexOf('Edge/') != -1 || ua.indexOf('MSIE ') != -1;
            let heightOffset = ie ? 52 : 50;
            if (container.classList.contains('table-container')) {
                container.style.minHeight = 'auto';
                // container 父的高度取不到时，取mainscroll的，解决safira 缺陷编号0012011514  dengxue
                let conMinHeight = container.parentNode.clientHeight;
                if (container.parentNode.clientHeight < 10) {
                    conMinHeight = document.querySelector('#mainScroll') ? document.querySelector('#mainScroll').clientHeight : 0;
                }
                container.style.minHeight = !document.querySelector('.home-wrap') &&
											container.classList.contains('table-container') &&
											container.parentNode
                    ? `${conMinHeight - heightOffset}px` : 'auto';
            }

            // window.removeEventListener('resize', containerResize);
            if (container.style.minHeight != 'auto' && container.classList.contains('table-container')) {
                window.onresize = containerResize;
                // window.addEventListener('resize', containerResize);
                function containerResize(evt) {
                    container.style.minHeight = 'auto';
                    container.style.minHeight = container.parentNode ? `${container.parentNode.clientHeight - heightOffset}px` : 'auto';
                    container.style.overflowX = tableHeader.clientWidth > container.clientWidth ? 'scroll' : 'initial';
                }
            }

            for (var i = 0; i < tableHeaderItem.length; i++) {
                if (!tableHeaderItem[i].classList.contains('gutter')) {
                    let draggableBox = document.createElement('span');
                    let targetColName = tableHeaderItem[i].classList[0];
                    draggableBox.setAttribute('draggable-cell', '');
                    tableHeaderItem[i].appendChild(draggableBox);
                    if (tableHeaderItem[i].classList.contains('el-table-column--selection')) {
                        draggableBox.setAttribute('draggable-cell', 'false');
                        draggableBox.style.cursor = 'auto';
                    }
                }
            }

            tableHeader.addEventListener('mousedown', bindDraggable, false);

            container.addEventListener('scroll', (e) => {
                scrollLeftOffset = e.target.scrollLeft;
            });

            function bindDraggable(evtA) {
                // check agin the left offset
                leftSpace = elm.getBoundingClientRect().left;

                let cellIdentifier, oldX, newX, diffX; ;
                if (evtA.target.attributes['draggable-cell'] && evtA.target.attributes['draggable-cell'].value != 'false') {
                    cellIdentifier = evtA.target.parentNode.classList[0];
                } else {
                    return false;
                }
                oldX = evtA.pageX;
                elm.appendChild(dragLineHelper);
                dragLineHelper.style.display = 'block';
                elm.classList.toggle('noselect');
                document.addEventListener('mousemove', showDragHelper, false);
                document.addEventListener('mouseup', finishdrag, false);

                function finishdrag(evtB) {
                    newX = evtB.pageX;
                    diffX = newX - oldX;
                    updateCellWidth(cellIdentifier, diffX);
                    dragLineHelper.style.display = 'none';
                    elm.classList.toggle('noselect');
                    document.removeEventListener('mouseup', finishdrag, false);
                    document.removeEventListener('mousemove', showDragHelper, false);
                    // scrollbar jump showhide bug hack
                    headerWrapper.style.overflow = tableHeader.clientWidth > containerWidth ? 'visible' : 'initial';
                    bodyWrapper.style.overflow = tableHeader.clientWidth > containerWidth ? 'visible' : 'initial';
                    container.style.overflowX = tableHeader.clientWidth > containerWidth ? 'scroll' : 'initial';
                }
                function showDragHelper(evtC) {
                    evtC.preventDefault();
                    dragLineHelper.style.left = evtC.pageX - leftSpace + scrollLeftOffset + 'px';
                }
            }

            function updateCellWidth(identifier, diffValue) {
                for (var i = 0; i < allCols.length; i++) {
                    let col = allCols[i];
                    if (col.attributes.name.value === identifier) {
                        let newWidth = parseInt(col.width) + diffValue;
                        col.width = newWidth > 100 ? newWidth : 100;
                    }

                    if (col.attributes.name.value === lastColName) {
                        let currentLastColWidth = parseInt(col.width);

                        if (diffValue < 0) {
                            if (identifier != col.attributes.name.value) {
                                col.width = currentLastColWidth - diffValue;
                            } else {
                                if (currentLastColWidth + diffValue >= lastColMinWidth) {
                                    col.width = currentLastColWidth + diffValue;
                                } else {
                                    col.width = lastColMinWidth;
                                }
                            }
                        } else {
                            if (currentLastColWidth - diffValue >= lastColMinWidth) {
                                col.width = currentLastColWidth - diffValue;
                            } else {
                                col.width = lastColMinWidth;
                            }
                        }
                    }
                }
                updateFixedCell(identifier);
            }
            function updateFixedCell(identifier) {
                let newWidth = container.querySelector('colgroup').firstChild.attributes.width.value;
                let fixedCell = container.getElementsByClassName('td-fixed');
                for (var i = 0; i < fixedCell.length; i++) {
                    fixedCell[i].style.width = `${newWidth}px`;
                    let titleElm = fixedCell[i].querySelector('.title');
                    if (titleElm) {
                        titleElm.style.width = `${newWidth - 120}px`;
                    }
                }
            }
        });
    },
    componentUpdated(elm, bindign, vm) {
        vm.componentInstance.$nextTick(() => {
            const container = document.querySelector('.el-tabs__content') ? document.querySelector('.el-tabs__content') : elm.parentNode;
            let fixedCell = container.getElementsByClassName('td-fixed');
            if (fixedCell.length < 2) {
                return false;
            }
            let widthTarget = container.querySelector('colgroup').firstChild;
            // 业务需求，任务列表，第一列有展开收起按钮的取第二列col的宽度，解决safari标题超宽 by dengxue
            let widthTarget1 = container.querySelector('colgroup').firstChild.nextSibling;

            container.removeEventListener('scroll', scrollEvt);
            container.addEventListener('scroll', scrollEvt);

            // cache组件和页面切换更新fixed位置
            updateFixedCell(container.scrollLeft);
            container.querySelector('.el-table__body-wrapper>table').style.overflow = 'hidden';
            container.querySelector('.el-table__body-wrapper>table').style.position = 'relative';
            function scrollEvt(e) {
                updateFixedCell(e.target.scrollLeft);
            }
            function updateFixedCell(left) {
                let newWidth = widthTarget.attributes.width.value;
                if (parseInt(newWidth) < 10) {
                    newWidth = widthTarget1.attributes.width.value;
                }

                for (var i = 0; i < fixedCell.length; i++) {
                    fixedCell[i].style.width = `${newWidth}px`;
                    let titleElm = fixedCell[i].querySelector('.title');
                    if (titleElm) {
                        titleElm.style.width = `${newWidth - 120}px`;
                    }
                    // fixedCell[i].style.position = 'absolute';
                    fixedCell[i].style.left = fixedCell.length < 2 ? '0px' : `${left}px`;
                    if (left > 1 && !fixedCell[i].classList.contains('td-fixed-style') && fixedCell.length >= 2) {
                        fixedCell[i].classList.add('td-fixed-style');
                    } else if (left === 0) {
                        fixedCell[i].classList.remove('td-fixed-style');
                    }
                }
            }
        });
    }
});
