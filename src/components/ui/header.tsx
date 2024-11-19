import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Navbar } from 


function Header() {
    return (
        <>
            <header className='bg-black w-screen text-white drop-shadow-lg p-5'>
                <nav>
                    <div className='flex justify-between px-2 items-center w-full h-full'>
                        <div className='flex items-center cursor-pointer'>
                            <img className='h-8 auto'></img>
                        </div>
                        <ul className='flex gap-40 font-semibold'>
                            <a href='' className='hover:text-[#EE9D5E] cursor-pointer'>Inicio</a>
                            <a href='' className='hover:text-[#EE9D5E] cursor-pointer'>Menu</a>
                            <a href="/ReservaForm" className='hover:text-[#EE9D5E] cursor-pointer'>Reservar</a>
                        </ul>
                        <div className='cursor-pointer'>
                            <FaUserCircle size={40}/>
                        </div>
                    </div>
                </nav>
            </header>

        </>
    )
}

export default Header
