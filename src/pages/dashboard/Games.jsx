import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Games = () => {
  const objgames = [
    {
      id: 1,
      name: "X vs O",
      gameHost: "https://jasurbe77.github.io/XvsO/",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1tGjcEo9pck19-fV2-Hfhu_25V_glg3Sa4Q&s",
      description: "X vs O Game chuda yaxshi oyin bu oyinni 2-ta odam bolib oynaladi",
    },
    {
      id: 2,
      name: "Monkey type game",
      gameHost: "https://monkeytype.com/",
      image:"data:image/jpeg;base64,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",
      description: "Bu yerda siz ozingizni type ningizni oshira olasiz",
    },
  ];

  // Motion variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div 
      className="mb-30"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-10 flex-wrap">
        {objgames.map((e) => (
          <motion.div 
            key={e.id} 
            className="card bg-base-100 w-96 shadow-sm"
            variants={cardVariants}
          >
            <figure>
              <img
                src={e.image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                alt={e.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{e.name}</h2>
              <p>{e.description}</p>
              <div className="card-actions justify-end">
                <Link to={'/typer'} className="btn btn-neutral">O'yinga kirish</Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Games;
