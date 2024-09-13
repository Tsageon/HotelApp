import React from "react";
import { PiNewspaperClipping } from "react-icons/pi";
import { GiSmartphone } from "react-icons/gi";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { AiOutlineCopyright } from "react-icons/ai";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { CgMail } from "react-icons/cg";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
    return (
        <div className="footer">
            <div className="border"><h1 className="title">The Matrix Hotel</h1></div>
            <div className="newsletter">
                <div className="sub"><h3>Subcribe To Our Newsletter<b/><PiNewspaperClipping/></h3><br></br></div>
                <div className="input"><input type="text"/></div>
                <div className="button"><button>Subscribe</button></div><br></br>
                <div className="reservation"><h4>Reservations</h4></div><br></br>
                <div className="connect"><h6>Connect With Us</h6></div>
                <CgMail/> <BsTwitterX/>
                <div className="phone"><GiSmartphone/><p>087 310 5230</p></div>
                <div className="phone"><TbDeviceLandlinePhone/><p>+1-700-897-563</p></div><br></br>
                <div className="copyright"><AiOutlineCopyright/><p>2024 The Matrix Hotel</p></div><br/>
                <div className="scroll"><button><IoIosArrowDropupCircle/></button></div>
                </div>
        </div>
    );
};
export default Footer