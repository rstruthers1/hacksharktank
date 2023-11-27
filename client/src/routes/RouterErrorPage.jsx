import { useRouteError } from "react-router-dom";
import ErrorPage from "../components/common/ErrorPage/ErrorPage";

export default function RouterErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <ErrorPage errorMessage={error && (error.statusText || error.message)}/>
    );
}