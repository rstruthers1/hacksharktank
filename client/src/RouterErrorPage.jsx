import { useRouteError } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";

export default function RouterErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <ErrorPage errorMessage={error && (error.statusText || error.message)}/>
    );
}