import axios from "axios";
import AppRouter from "../routers/AppRouter";
export const instance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: { "Content-Type": "application/json"}
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if ([500, 502, 503, 429].includes(status)) {
                AppRouter.push("/500")
            }

            if(status === 401) {
                AppRouter.push("/login");
            }

        }

        return Promise.reject(error);
    }
)

export const api  = ({ url, open = false, ...props }) => {
    const token = localStorage.getItem("accessToken");

    if (!open) {
        props.headers = {
            Authorization: `Bearer ${token}`,
            ...props.headers,
        };
    }

    return instance({ url, ...props});
}


export { instance as axiosInstance};

export default api;


