import { get, post, put, deleted } from "./index";
const preUrl = "/ly/mp/mom/mes/vmes";

/* =============公共接口============ */
// 工厂查询
export function queryPlant(data) {
    return post({
        url: preUrl + "/vehicle/system/sysbase/getPlant.do",
        params: data,
    });
}
// 组织查询
export function queryOrgnaztion(data) {
    return post({
        url: preUrl + "/vehicle/system/sysbase/getOrganization.do",
        params: data,
    });
}
// 车间查询
export function queryLocation(data) {
    return post({
        url: preUrl + "/vehicle/system/sysbase/getLocation.do",
        params: data,
    });
}
// 产线查询
export function queryLineNo(data) {
    return post({
        url: preUrl + "/vehicle/system/sysbase/getLine.do",
        params: data,
    });
}

/* =============计划接口============ */

// 作业形式管理查询
export function queryProductionType(data) {
    return post({
        url: preUrl + "/plan/workingPartternService/queryWorkingParttern.do",
        params: data,
    });
}
// 作业形式管理明细查询
export function queryProductionTypeItem(data) {
    return post({
        url: preUrl + "/plan/workingPartternService/queryWorkingPartternD.do",
        params: data,
    });
}
// 作业形式管理保存
export function saveProductionType(data) {
    return post({
        url: preUrl + "/plan/workingPartternService/saveWorkingParttern.do",
        params: data,
    });
}
// 作业形式管理删除
export function delProductionType(data) {
    return post({
        url: preUrl + "/plan/workingPartternService/delWorkingParttern.do",
        params: data,
    });
}
//工作日历管理查询
export function queryCalendar(data) {
    return post({
        url: preUrl + "/plan/calendarService/queryCalendar.do",
        params: data,
    });
}
//工作日历管理保存
export function saveCalendar(data) {
    return post({
        url: preUrl + "/plan/calendarService/saveCalendar.do",
        params: data,
    });
}
//工作日历管理上传
export function uploadCalendar(data) {
    return post({
        url: preUrl + "/plan/calendarService/importCalendar.do",
        params: data,
    });
}
