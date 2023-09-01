import React, {useState} from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faBullhorn } from '@fortawesome/free-solid-svg-icons'
import DropDown from "./DropDown";


const UserMenu = ({ session }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    let userIcon = (<FontAwesomeIcon icon={faCircleUser} size={"3x"} fixedWidth/>)
    let dropDownMenu = (
        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Link href="/api/auth/signin">
                Log in
            </Link>
        </div>
    )

    if(session){
        userIcon = (<img
            src={session?.user?.image ?? ""}
            alt={session?.user?.name ?? ""}
            className={"rounded-full h-[48px] w-[48px]"}
            referrerPolicy={"no-referrer"}
        />)

        dropDownMenu = (
            <>
                <div className="px-4 py-2 text-sm text-gray-500 italic">
                    {session?.user?.name ?? ""}
                </div>

                <Link
                    href="/drafts"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                    My drafts
                </Link>

                <button
                    onClick={() => signOut()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                    Sign out
                </button>
            </>
        )
    }
    return (
        <DropDown dropDownMenu={dropDownMenu} dropDownButton={userIcon}/>
    );
}



const Header: React.FC = () => {

    const { data: session } = useSession();

    let feed = (

        <Link href="/" className={'py-1.5 px-3 font-bold border-black border-2 rounded'}>
            Speak out
            <FontAwesomeIcon icon={faBullhorn} className={'ml-2'}/>
        </Link>


    )

    let right = (
        <div className="flex items-center gap-5">
            <UserMenu session={session}/>
        </div>
    );
    let left = (
        <div className="flex items-center gap-2">
            {feed}
        </div>
    );

    if (session){
        left = (
            <div className="flex items-center gap-2">
                {feed}
                <Link href="/create" className={'italic cursor-pointer'}>
                    What's on your mind?
                </Link>
            </div>
        );
    }

    return (
        <nav className={'w-full flex items-center justify-between p-[2rem]'}>
            {left}
            {right}
        </nav>
    );
};

export default Header;