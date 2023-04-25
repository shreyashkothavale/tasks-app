import React, { useEffect, useState } from "react";
import "./Reminder.css";
import { HiCheck, HiPlus } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
function Reminder() {
  const generateRandomId = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 10; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return id;
  };

  let taskId = generateRandomId();
  const [links, setLinks] = useState([
    {
      id: 0,
      name: "All",
      tasks: [{ taskId: taskId, task: "Start Adding tasks" }]
    }
  ]);
  const [isMenuActive, setIsMenuActive] = useState(true);
  const [active, setActive] = useState(links[0].id);
  const [openInput, setOpenInput] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [taskVal, setTaskVal] = useState("");
  const [openTasksInput, setOpenTaskInput] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log(`${JSON.stringify(links)} + links`);
    setTasks([]);
    setIsLoading(true);
    setTimeout(() => {
      setTasks(links[active].tasks);
      setIsLoading(false);
    }, 1000);
  }, [active, setActive]);
  const addToList = () => {
    if (inputVal === undefined || inputVal.trim() === "") {
      alert("Please insert list name");
    } else {
      let linksId = Number(Number(links.length));
      setLinks((prevLinks) => [
        ...prevLinks,
        {
          id: linksId,
          name: inputVal,
          tasks: []
        }
      ]);

      setInputVal("");
      setOpenInput(false);
    }
  };
  const addTask = () => {
    if (taskVal && taskVal.trim() !== "") {
      setOpenTaskInput(false);

      const newTask = {
        taskId: generateRandomId(),
        task: taskVal
      };
      // console.log(links);
      const updatedLinks = [...links];
      // console.log(`${JSON.stringify(updatedLinks[1])} + active link`);
      updatedLinks[active].tasks.push(newTask);
      // console.log(updatedLinks); // add this line to log the updated links array
      setLinks(updatedLinks);

      setTaskVal("");
    }
  };
  return (
    <div
      className={`${
        isMenuActive
          ? "active-container reminder-container"
          : "reminder-container"
      }`}
    >
      <AnimatePresence initial={false}>
        {isMenuActive && (
          <motion.div
            animate={{ width: "200px" }}
            initial={{ width: "0px" }}
            exit={{ width: "0px" }}
            className="sidebar"
          >
            <div className="links">
              {links.map((item, index) => {
                return (
                  <li
                    className={`${active === item.id ? "active link" : "link"}`}
                    onClick={() =>{ setActive(item.id)
                    if(openTasksInput){
                      setOpenTaskInput(false)
                    }
                    }}
                    key={index}
                  >
                    <p>{item.name}</p>
                  </li>
                );
              })}
              {openInput && (
                <li className="list-input">
                  <div className="input-container">
                    <input
                      type="text"
                      autoComplete="off"
                      value={inputVal}
                      style={{ width: "100%" }}
                      name="listinput"
                      onChange={(e) => {
                        e.preventDefault();

                        setInputVal(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") addToList();
                      }}
                    />
                    <button className="listadd" onClick={addToList}>
                      <HiPlus style={{ color: "darkgray" }} />
                    </button>
                  </div>
                </li>
              )}
            </div>
            <div className="bottom">
              <button onClick={() => setOpenInput(true)}>Add</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="menucontainer">
        <div
          className="menu"
          onClick={() => {
            setIsMenuActive(!isMenuActive);
          }}
        ></div>
      </div>
      <div className="reminders">
        <div className="content">
          <div className="header">
            <div
              className="heading"
              style={{
                width: "50%"
              }}
            >
              <h3
                style={{
                  width: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {links.map((item, index) =>
                  item.id === active ? item.name : ""
                )}
              </h3>
            </div>
            <div className="btn-container">
              <button
                onClick={() => {
                  setOpenTaskInput(true);
                }}
              >
                Add New Task
              </button>
            </div>
          </div>
          <div className="tasks">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <AnimatePresence>
                {tasks.length > 0 &&
                  tasks.map((item, index) => {
                    // console.log(`${JSON.stringify(item)}+ ${index}`);
                    return (
                      item.task !== "" && (
                        <motion.li
                          layout
                          variants={{
                            hidden: {
                              opacity: 0,
                              y: -20
                            },
                            visible: (index) => ({
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: index * 0.05
                              }
                            })
                          }}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          custom={index}
                          className="task"
                          key={index}
                        >
                          <p>{item.task}</p>
                          <span
                            onClick={() => {
                              let newTasks = links[active].tasks.filter(
                                (el) => {
                                  return el.taskId !== item.taskId;
                                }
                              );
                              let link = [...links];
                              link[active].tasks = newTasks;
                              setLinks(link);
                              // console.log(links);
                              setTasks(links[active].tasks);
                              // console.log(links);
                            }}
                          >
                            &times;
                          </span>
                        </motion.li>
                      )
                    );
                  })}
              </AnimatePresence>
            )}
            {isLoading
              ? ""
              : active === links[0].id &&
                links.map((item, index) => {
                  return (
                    <div>
                      {active !== item.id &&
                        item.tasks.map((el, i) => {
                          return (
                            <motion.div
                              variants={{
                                hidden: {
                                  opacity: 0,
                                  y: -20
                                },
                                visible: (i) => ({
                                  opacity: 1,
                                  y: 0,
                                  transition: {
                                    delay:
                                      links[active]?.tasks.length > 0
                                        ? links[active]?.tasks.length * 0.05
                                        : i * 0.05
                                  }
                                })
                              }}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              custom={i}
                              className="alltask"
                              key={item.taskId}
                            >
                              <p>{el.task}</p>
                              <span>{item.name}</span>
                            </motion.div>
                          );
                        })}
                    </div>
                  );
                })}

            {openTasksInput && (
              <div className="task">
                <input
                  type="text"
                  autoComplete="false"
                  style={{
                    width: "80%",
                    border: "none",
                    background: "transparent",
                    outline: "none"
                  }}
                  value={taskVal}
                  onChange={(e) => {
                    e.preventDefault();
                    setTaskVal(e.target.value);
                  }}
                  // onSubmit={addTask}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                />
                <span onClick={addTask}>
                  <HiCheck
                    fontSize="10px"
                    style={{ color: "darkgray", fontWeight: "bold" }}
                  />
                </span>
                <span onClick={() => setOpenTaskInput(false)}>&times;</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reminder;
