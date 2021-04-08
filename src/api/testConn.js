export function testConn(url = uni.getStorageSync('serverUrl')) {
    uni.request({
        url: url + "test",
        method: "GET",
        success: (res) => {
            let msg = "";
            if (res.data === 1) {
                msg = `${url}\n连接成功`;
            } else {
                msg = `${url}\n服务器返回无效`;
            }
            uni.showToast({
                title: msg,
                icon: "none",
                mask: false,
                duration: 2000,
                position: "bottom"
            });
        },
        fail: (res) => {
            uni.showToast({
                title: `${url}\n连接失败`,
                icon: "none",
                mask: false,
                duration: 2000,
                position: "bottom"
            });
        }
    })
}
