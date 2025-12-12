// import React from "react";
// import { Link } from "react-router-dom";
// import { Code, LampDesk, Backpack, Gamepad2, User, ChartNoAxesColumn } from "lucide-react";
// const Sidebar = () => {
//   return (
//     <div>
//       <div className="shadow-xl px-5 py-5 rounded-xl hidden md:block w-[300px] h-[650px]">
//         <div>
//           <div>
//             <ul className="flex flex-col gap-5">
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to={'/'}><LampDesk /> Home</Link></li>
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white"  to={'/homework'}><Backpack /> HomeWork</Link></li>
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to={'/games'}><Gamepad2 /> Games</Link></li>
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to={'/code'}><Code /> Code</Link></li>
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to={'/profile'}><User />1Profile</Link></li>
//               <li><Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to={'/rating'}><ChartNoAxesColumn /> Rating</Link></li>
//             </ul>
//           </div>
//         </div>


//       </div>
//       <div className="block md:hidden relative bottom-0">
//         <div className="dock dock-xl">
//   <button>
//     <LampDesk />
//     <Link to={'/'}>Home</Link>
//   </button>
  
//   <button>
//     <Backpack />
//     <Link to={'/homework'}>HomeWork</Link>
//   </button>
//   <button>
//     <Gamepad2 />
//     <Link to={'/games'}>Games</Link>
//   </button>
//     <button>
//     <ChartNoAxesColumn />
//     <Link to={'/rating'}>Rating</Link>
//   </button>
  
// </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Code, LampDesk, Backpack, Gamepad2, User, ChartNoAxesColumn } from "lucide-react";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="shadow-xl px-5 py-5 rounded-xl hidden md:block w-[300px] h-[650px]">
        <div>
          <div>
            <ul className="flex flex-col gap-5">
              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/">
                  <LampDesk /> {t("home")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/homework">
                  <Backpack /> {t("homework-link")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/games">
                  <Gamepad2 /> {t("games")}
                </Link>
              </li>

              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/reviews">
                  <Code /> {t("code")}
                </Link>
              </li>


              <li>
                <Link className="flex items-center gap-3 py-2 w-full px-3 rounded-xl hover:bg-black hover:text-white" to="/rating">
                  <ChartNoAxesColumn /> {t("rating")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile version */}
     <div className="container">
       <div className="block md:hidden mb-10 relative bottom-0">
        <div className="dock dock-xl rounded-2xl">
          <button>
            <LampDesk />
            <Link to="/">{t("home")}</Link>
          </button>

          <button>
            <Backpack />
            <Link to="/homework">{t("homework-link")}</Link>
          </button>

          <button>
            <Gamepad2 />
            <Link to="/games">{t("games")}</Link>
          </button>

          <button>
            <ChartNoAxesColumn />
            <Link to="/rating">{t("rating")}</Link>
          </button>
        </div>
      </div>
     </div>
    </div>
  );
};

export default Sidebar;
