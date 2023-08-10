import { useState, useEffect } from "react";
import { Tooltip } from "primereact/tooltip";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

import * as classes from "./app.module.css";

function App() {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [emojiList, setEmojiList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const [category, setCategory] = useState("");
  const [isError, setError] = useState(false);

  useEffect(() => {
    fetch("https://emojihub.yurace.pro/api/all")
      .then((response) => response.json())
      .then((data) => setEmojiList(data))
      .catch(() => setError(true))
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const htmlEntitiesToUnicode = (input) => {
    return input.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCodePoint(Number(dec));
    });
  };

  const filterEmojiList = () => {
    return category === ""
      ? emojiList
      : emojiList.filter((item) =>
          item.category.toLowerCase().includes(category.toLowerCase())
        );
  };

  const handleCopy = (value, index) => {
    setCopiedIdx(index);
    setCopied(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setCopied(false);
      setCopiedIdx(null);
    }, 1000);
  };

  return (
    <div className="md:p-4">
      <div
        className={`flex justify-content-center text-4xl font-semibold mb-4 ${classes.heading}`}
      >
        Emoji Explorer
      </div>
      <span className="w-full mb-4 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setFirst(0);
          }}
          placeholder="Search emojis by category"
          pt={{
            root: { className: "w-full" },
          }}
        />
      </span>
      {emojiList.length === 0 ? (
        <div>
          <ProgressSpinner
            style={{ width: "50px", height: "50px", display: "flex" }}
            strokeWidth="4"
            fill="surface-900"
            animationDuration="1s"
          />
          <div
            className={`flex justify-content-center ${classes.heading} mb-4`}
          >
            Loading Data...
          </div>
        </div>
      ) : isError ? (
        <div
            className={`flex justify-content-center ${classes.errorHeading} mb-4`}
          >
            Sorry, seems like api is down... :(
          </div>
      ) : (
        <div className="flex flex-column gap-2 mb-4">
          {(filterEmojiList() || []).length === 0 ? (
            <div className={`flex justify-content-center ${classes.heading}`}>
              No data to show
            </div>
          ) : (
            (filterEmojiList() || [])
              .slice(first, first + rows)
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`flex-grow-1 md:flex-grow-0 p-2 shadow-1 border-round-md ${classes.mycard}`}
                  >
                    <div className="flex text-4xl sm:text-6xl align-items-center justify-content-between">
                      {htmlEntitiesToUnicode(item.htmlCode[0])}
                      {copied && copiedIdx === index ? (
                        <span className="text-sm text-green-400">copied</span>
                      ) : (
                        <>
                          <i
                            className="custom-target-copy-icon text-xl cursor-pointer pi pi-copy"
                            data-pr-tooltip="copy emoji code"
                            data-pr-position="left"
                            onClick={() => handleCopy(item.htmlCode[0], index)}
                          />
                          <Tooltip target=".custom-target-copy-icon" />
                        </>
                      )}
                    </div>
                    <div>
                      <span className="text-xl">Name:</span> {item.name}
                    </div>
                    <div>
                      <span className="text-xl">Code:</span> {item.htmlCode[0]}
                    </div>
                    <div>
                      <span className="text-xl">Group:</span> {item.group}
                    </div>
                    <div>
                      <span className="text-xl">Category:</span> {item.category}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
      <div>
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filterEmojiList().length}
          onPageChange={onPageChange}
          pt={{
            root: { className: "surface-900" },
          }}
          template={{
            layout:
              "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
          }}
        />
      </div>
    </div>
  );
}

export default App;
