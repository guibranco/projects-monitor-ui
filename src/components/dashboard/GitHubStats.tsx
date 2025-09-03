import React from "react";

export function GitHubStats() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        GitHub Stats
      </h2>
      <img
        src="https://github-readme-streak-stats-guibranco.vercel.app/?user=guibranco&theme=github-green-purple&fire=FF6600&refresh=98529"
        alt="GitHub streak"
        className="w-full mb-4"
      />
      <img
        src="https://github-readme-stats-guibranco.vercel.app/api?username=guibranco&line_height=28&card_width=490&hide_title=true&hide_border=true&show_icons=true&theme=chartreuse-dark&icon_color=7FFF00&include_all_commits=true&count_private=true&show=reviews,discussions_started&count_private=true&refresh=98529"
        alt="GitHub Stats"
        className="w-full mb-4"
      />
    </div>
  );
}
