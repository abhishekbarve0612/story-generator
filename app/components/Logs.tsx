import { ScrollArea, Button, Accordion } from "@abhishekbarve/components";
import { useState } from "react";
import { MdAutoAwesome, MdExpandLess, MdExpandMore } from "react-icons/md";

function Logs() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      character: "Nora",
      content:
        "The old library felt different tonight. Something in the air made the hairs on my neck stand on end as I traced my fingers along the dusty spines.",
      timestamp: "2:34 PM",
    },
    {
      id: 2,
      character: "John",
      content:
        "From the shadows between the towering shelves, I watched her. She was close now, so very close to discovering what we'd kept hidden for decades.",
      timestamp: "2:35 PM",
    },
    {
      id: 3,
      character: "Nora",
      content:
        "A leather-bound journal caught my eye, its cover unmarked but somehow familiar. As I pulled it from the shelf, a piece of parchment fluttered to the floor.",
      timestamp: "2:36 PM",
    },
  ]);

  const contextSummary =
    "A mysterious encounter unfolds in an old library where Nora, a curious detective, searches through ancient books while being secretly observed by John. The story has taken a supernatural turn with hidden secrets about to be revealed through an old journal.";

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200">
        <Accordion collapsible className="w-full">
          <Accordion.Item value="context" className="border-none">
            <Accordion.Trigger className="text-left px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium text-sm">Story Context</div>
                  <div className="text-xs text-gray-500">
                    Summary of the conversation so far
                  </div>
                </div>
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="px-4 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900 leading-relaxed">
                  {contextSummary}
                </p>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="border border-gray-200 bg-gray-50 h-[80vh]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {message.character}
                    </span>
                    <span className="text-xs text-gray-400">
                      {message.timestamp}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">
                  Generated story content will appear here
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Generate Button Section - Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-center">
          <Button size="lg" className="min-w-[200px]">
            <MdAutoAwesome className="w-5 h-5 mr-2" />
            Generate Next Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Logs;
