import React from "react";
import { Bug, GitPullRequest, Timer, Github } from "lucide-react";
import { StatCard } from "./StatCard";
import { mockData } from "../../lib/mockData";

export function GitHubActivity() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={Github}
        label="Pull Requests"
        value={mockData.githubPRs}
        color="purple"
      />
      <StatCard
        icon={Bug}
        label="Bug Issues"
        value={mockData.bugIssues}
        color="red"
      />
      <StatCard
        icon={GitPullRequest}
        label="PR Blocked"
        value={mockData.prBlocked}
        color="yellow"
      />
      <StatCard
        icon={Timer}
        label="WIP Issues"
        value={mockData.wipIssues}
        color="orange"
      />
    </div>
  );
}
