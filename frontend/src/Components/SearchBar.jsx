import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";

const SearchBar = ({ setTag }) => {
    const [searchItem, setSearchItem] = useState("");
    let { IS_SM } = useWindowSize();
    const [xOff, setXOff] = useState(0);
    const [yOff, setYOff] = useState(0);

    useEffect(()=>{
        setXOff(!IS_SM ? 0 : 2.5);
        setYOff(!IS_SM ? 6 : 1.9);
    }, [IS_SM])

    return (
        <InputGroup className={`position-fixed w-${!IS_SM ? "25" : "75"}`}
        style={{ left: (2 + xOff) + "rem", top: (2 + yOff) + "rem"}}>
            <Form.Control
                type="text"
                placeholder="Search an article"
                className=" rounded-start-4"
                onChange={(e)=>setSearchItem(e.target.value)}
            />
            <Button variant="danger" className="rounded-end-4" 
                onClick={()=>setTag(searchItem)}>
                <i className="bi bi-search " />
            </Button>
        </InputGroup>
    );
};

export default SearchBar;
