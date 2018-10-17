<template>
    <div v-if="user">
        <div :class="{'left': styleType === 'normal'}">
            <span>{{ name }}</span>
            <span v-if="nickName">
                ({{ nickName }})
            </span>
        </div>
        <div
            v-if="companyName || groupName"
            :class="{'right': styleType === 'normal'}"
            class="description">
            <span v-if="companyName">
                {{ companyName.slice(0,4) }}
            </span>
            <span v-if="companyName && groupName">
                -
            </span>
            <span v-if="groupName">
                {{ groupName }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserList',
    props: {
        user: Object,
        size: String
    },
    computed: {
        styleType() {
            return this.size || 'normal';
        },
        name() {
            return (
                this.user.username || this.user.userName || this.user.user_name
            );
        },
        nickName() {
            return this.user.nickName || this.user.nick_name;
        },
        companyName() {
            return this.user.companyName || this.user.company_name;
        },
        groupName() {
            const finalName =
                this.user.departmentName || this.user.department_name
                    ? this.user.departmentName || this.user.department_name
                    : this.user.userRole;
            return finalName;
        }
    }
};
</script>

<style scoped lang="less">
.left {
    float: left;
    padding-right: 10px;
}
.right {
    float: right;
    padding-left: 10px;
}
.description {
    color: rgb(132, 146, 166);
    font-size: 12px;
    padding-top: 3px;
}
</style>
