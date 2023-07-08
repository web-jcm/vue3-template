import {
    queryPlant,
    queryOrgnaztion,
    queryLocation,
    queryLineNo,
} from "@/api/mes";
//获取工厂
export async function usePlant() {
    try {
        const res = await queryPlant();
        if (res.result == "1") {
            return res.rows;
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        console.log(err);
    }
}
//获取组织
export async function useOrgnaztion(data) {
    try {
        const res = await queryOrgnaztion(data);
        if (res.result == "1") {
            return res.rows;
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        console.log(err);
    }
}
//获取车间
export async function useLocation(data) {
    try {
        const res = await queryLocation(data);
        if (res.result == "1") {
            return res.rows;
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        console.log(err);
    }
}
//获取生产线
export async function useLineNo(data) {
    try {
        const res = await queryLineNo(data);
        if (res.result == "1") {
            return res.rows;
        } else {
            $message.warning(res.msg);
        }
    } catch (err) {
        console.log(err);
    }
}
