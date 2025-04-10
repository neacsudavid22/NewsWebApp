import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';

import AddFriendModal from './AddFriendModal';
import ShareIdModal from './ShareIdModal';
import FriendRequestsModal from './FriendRequestsModal';

const MainNavbar = () => {
    const { user, logout } = useContext(AuthContext); 

    const handleLogout = () => {
        if(user){ logout() }
    }

    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showShareId, setShowShareId] = useState(false);
    const [showFriendRequests, setShowFriendRequests] = useState(false);

    const navigate = useNavigate();

    const handleProfile = () => {
        if(user._id)
            navigate('/profile/' + user._id);
        return;
    }

    

    return(
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="w-100 m-0 p-2 px-3">
            <Stack direction="horizontal" className="d-flex justify-content-between w-100">

                <Navbar.Brand as={Link} to="/"> NewsWebApp </Navbar.Brand>
            
                {user ? (
                    <Stack direction="horizontal">

                        <SplitButton
                        variant="danger"
                        align="end"
                        title={('@' + user?.username) || "loading.." }
                        id="dropdown-menu-align-end"
                        >
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowAddFriend(true)}>Add a friend</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowShareId(true)}>Share your id</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={handleProfile}>Go to profile</Dropdown.Item>
                            <Dropdown.Item type="button" variant="danger" onClick={() => setShowFriendRequests(true)}>View friend requests</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item type="button" as={Link} to="/" onClick={handleLogout}>Logout</Dropdown.Item>
                        </SplitButton>

                        <AddFriendModal show={showAddFriend} handleClose={() => setShowAddFriend(false)} />
                        <ShareIdModal show={showShareId} handleClose={() => setShowShareId(false)} userId={user._id} />
                        <FriendRequestsModal 
                            show={showFriendRequests} 
                            handleClose={() => setShowFriendRequests(false)} 
                        />

                    </Stack>
                ) : (
                    <Button className="text-light" variant="danger" as={NavLink} to="/login">Login</Button>
                )}
            </Stack>
        </Navbar>
    );
}

export default MainNavbar;
