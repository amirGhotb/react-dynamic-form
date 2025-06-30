import {Button, Grid} from "@mui/material";
import {Link} from "react-router";

export default function Home() {
    return <Grid container justifyContent={'center'} minHeight={'100vh'} alignItems={'center'}>
        <Link to="/register?currency=IRR">
            <Button variant={'contained'}>Register</Button>
        </Link>
    </Grid>;
}
