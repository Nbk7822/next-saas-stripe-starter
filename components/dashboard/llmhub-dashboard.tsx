"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProtectedUserMenu } from "@/components/layout/protected-user-menu";

type VmTier = "Burstable" | "General" | "Memory" | "Compute" | "GPU";
type VmStatus = "running" | "stopped" | "provisioning" | "suspended";

interface AzureVmSize {
  name: string;
  vcpu: number;
  memory: number;
  storage: number;
  price: number;
  tier: VmTier;
}

interface Agent {
  id: "openclaw" | "shellpilot" | "infrabot" | "secureguard" | "custom";
  name: string;
  desc: string;
  icon: string;
  color: string;
}

interface Vm {
  id: number;
  name: string;
  size: string;
  status: VmStatus;
  agent: Agent["id"];
  ip: string;
  uptime: string;
  cpu: number;
  mem: number;
  region: string;
}

interface TerminalLine {
  type: "input" | "agent" | "system" | "success" | "error";
  text: string;
  time: string;
}

const AZURE_VM_SIZES: AzureVmSize[] = [
  {
    name: "B1s",
    vcpu: 1,
    memory: 1,
    storage: 4,
    price: 0.0104,
    tier: "Burstable",
  },
  {
    name: "B2s",
    vcpu: 2,
    memory: 4,
    storage: 8,
    price: 0.0416,
    tier: "Burstable",
  },
  {
    name: "B4ms",
    vcpu: 4,
    memory: 16,
    storage: 32,
    price: 0.166,
    tier: "Burstable",
  },
  {
    name: "D2s_v5",
    vcpu: 2,
    memory: 8,
    storage: 75,
    price: 0.096,
    tier: "General",
  },
  {
    name: "D4s_v5",
    vcpu: 4,
    memory: 16,
    storage: 150,
    price: 0.192,
    tier: "General",
  },
  {
    name: "D8s_v5",
    vcpu: 8,
    memory: 32,
    storage: 300,
    price: 0.384,
    tier: "General",
  },
  {
    name: "D16s_v5",
    vcpu: 16,
    memory: 64,
    storage: 600,
    price: 0.768,
    tier: "General",
  },
  {
    name: "E4s_v5",
    vcpu: 4,
    memory: 32,
    storage: 150,
    price: 0.252,
    tier: "Memory",
  },
  {
    name: "E8s_v5",
    vcpu: 8,
    memory: 64,
    storage: 300,
    price: 0.504,
    tier: "Memory",
  },
  {
    name: "F4s_v2",
    vcpu: 4,
    memory: 8,
    storage: 64,
    price: 0.169,
    tier: "Compute",
  },
  {
    name: "F8s_v2",
    vcpu: 8,
    memory: 16,
    storage: 128,
    price: 0.338,
    tier: "Compute",
  },
  {
    name: "NC6s_v3",
    vcpu: 6,
    memory: 112,
    storage: 736,
    price: 3.06,
    tier: "GPU",
  },
];

const AGENTS: Agent[] = [
  {
    id: "openclaw",
    name: "Openclaw",
    desc: "General-purpose VM automation agent",
    icon: "🦀",
    color: "#FF6B4A",
  },
  {
    id: "shellpilot",
    name: "ShellPilot",
    desc: "Bash & terminal command specialist",
    icon: "🐚",
    color: "#4ADE80",
  },
  {
    id: "infrabot",
    name: "InfraBot",
    desc: "Infrastructure provisioning & monitoring",
    icon: "🤖",
    color: "#60A5FA",
  },
  {
    id: "secureguard",
    name: "SecureGuard",
    desc: "Security auditing & hardening",
    icon: "🛡️",
    color: "#FBBF24",
  },
  {
    id: "custom",
    name: "Custom API",
    desc: "Bring your own LLM endpoint",
    icon: "🔌",
    color: "#A78BFA",
  },
];

const SAMPLE_PROMPTS = [
  "Install nginx and configure a reverse proxy on port 8080",
  "Check disk usage and clean up temp files over 100MB",
  "Set up a cron job to backup /var/data every 6 hours",
  "Install Docker, pull redis:latest, and run it on port 6379",
  "Show me all running processes sorted by memory usage",
];

function StatusDot({ status }: { status: VmStatus }) {
  const colors: Record<VmStatus, string> = {
    running: "#4ADE80",
    stopped: "#EF4444",
    provisioning: "#FBBF24",
    suspended: "#6B7280",
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: colors[status] || "#6B7280",
        boxShadow: status === "running" ? `0 0 8px ${colors.running}` : "none",
        animation:
          status === "provisioning"
            ? "pulse 1.5s ease-in-out infinite"
            : "none",
      }}
    />
  );
}

export default function LLMHubDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "machines" | "scripts" | "settings"
  >("dashboard");
  const [showNewVM, setShowNewVM] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent["id"]>("openclaw");
  const [vmName, setVmName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedVM, setSelectedVM] = useState(0);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [scriptMode, setScriptMode] = useState(false);
  const [scriptContent, setScriptContent] = useState(
    "# Write your automation script here\n# Available: vm.exec(), vm.upload(), vm.download()\n# Example:\n\nresult = vm.exec('uname -a')\nprint(result.stdout)\n\nif 'Ubuntu' in result.stdout:\n    vm.exec('apt update && apt upgrade -y')\n    vm.exec('apt install -y nginx')\n    print('Nginx installed successfully')",
  );
  const [tierFilter, setTierFilter] = useState<"All" | VmTier>("All");
  const termRef = useRef<HTMLDivElement | null>(null);

  const [vms] = useState<Vm[]>([
    {
      id: 1,
      name: "prod-api-01",
      size: "D4s_v5",
      status: "running",
      agent: "openclaw",
      ip: "10.0.1.24",
      uptime: "14d 6h 32m",
      cpu: 42,
      mem: 61,
      region: "East US",
    },
    {
      id: 2,
      name: "ml-training-gpu",
      size: "NC6s_v3",
      status: "running",
      agent: "infrabot",
      ip: "10.0.2.18",
      uptime: "3d 11h 05m",
      cpu: 89,
      mem: 78,
      region: "West US 2",
    },
    {
      id: 3,
      name: "staging-web",
      size: "B2s",
      status: "stopped",
      agent: "shellpilot",
      ip: "—",
      uptime: "—",
      cpu: 0,
      mem: 0,
      region: "East US",
    },
    {
      id: 4,
      name: "dev-sandbox",
      size: "D2s_v5",
      status: "provisioning",
      agent: "openclaw",
      ip: "—",
      uptime: "—",
      cpu: 0,
      mem: 0,
      region: "Central US",
    },
  ]);

  const currentVm = vms[selectedVM] ?? vms[0];
  const currentAgent = AGENTS.find((a) => a.id === currentVm?.agent);
  const workspaceView = searchParams.get("workspace");

  const simulateExecution = (cmd: string) => {
    if (!currentVm) return;

    setIsExecuting(true);
    const agent = AGENTS.find((a) => a.id === currentVm.agent) ?? AGENTS[0];
    setTerminalLines((prev) => [
      ...prev,
      { type: "input", text: cmd, time: new Date().toLocaleTimeString() },
      {
        type: "agent",
        text: `⟡ ${agent.name} interpreting prompt...`,
        time: "",
      },
    ]);

    window.setTimeout(() => {
      setTerminalLines((prev) => [
        ...prev,
        {
          type: "agent",
          text: "⟡ Translated to: sudo apt update && sudo apt install -y nginx && sudo systemctl enable nginx",
          time: "",
        },
        {
          type: "system",
          text: "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease",
          time: "",
        },
        {
          type: "system",
          text: "Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]",
          time: "",
        },
        { type: "system", text: "Reading package lists... Done", time: "" },
      ]);
    }, 1200);

    window.setTimeout(() => {
      setTerminalLines((prev) => [
        ...prev,
        { type: "system", text: "Building dependency tree... Done", time: "" },
        {
          type: "system",
          text: "The following NEW packages will be installed: nginx nginx-common nginx-core",
          time: "",
        },
        {
          type: "system",
          text: "Setting up nginx (1.18.0-6ubuntu14.4) ...",
          time: "",
        },
        {
          type: "success",
          text: "✓ nginx installed and enabled successfully",
          time: new Date().toLocaleTimeString(),
        },
        {
          type: "agent",
          text: `⟡ ${agent.name}: Task complete. nginx is now running on port 80.`,
          time: "",
        },
      ]);
      setIsExecuting(false);
    }, 3000);
  };

  useEffect(() => {
    if (
      workspaceView === "machines" ||
      workspaceView === "scripts" ||
      workspaceView === "settings"
    ) {
      setActiveTab(workspaceView);
      setShowNewVM(false);
      return;
    }

    if (workspaceView === "launch") {
      setActiveTab("dashboard");
      setShowNewVM(true);
      return;
    }

    setActiveTab("dashboard");
    setShowNewVM(false);
  }, [workspaceView]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const filteredSizes =
    tierFilter === "All"
      ? AZURE_VM_SIZES
      : AZURE_VM_SIZES.filter((s) => s.tier === tierFilter);

  return (
    <div
      className="llmhub-workspace-root"
      style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily:
          "var(--font-geist), var(--font-sans), Inter, system-ui, sans-serif",
        color: "#E4E4E7",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 3px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes termBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .llmhub-workspace-root [style*="color" i][style*="#71717a" i],
        .llmhub-workspace-root [style*="color" i][style*="#52525b" i],
        .llmhub-workspace-root [style*="color" i][style*="#a1a1aa" i],
        .llmhub-workspace-root [style*="color" i][style*="#3f3f46" i],
        .llmhub-workspace-root [style*="color" i][style*="#6b7280" i] {
          color: #fff !important;
        }
      `}</style>

      <div
        style={{
          padding: "24px 28px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 18,
          }}
        >
          <ProtectedUserMenu />
        </div>
        {activeTab === "dashboard" && !showNewVM && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
              }}
            >
              <div>
                <h1
                  className="spotlight-ink"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Command Center
                </h1>
                <p className="spotlight-ink-soft" style={{ fontSize: 13 }}>
                  Manage VMs and run AI-powered automation
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard?workspace=launch")}
                style={{
                  background: "linear-gradient(135deg, #FF6B4A, #E8553A)",
                  border: "none",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 0 20px rgba(255,107,74,0.25)",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 16 }}>+</span> New Machine
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Active VMs",
                  value: "3",
                  sub: "of 5 total",
                  accent: "#4ADE80",
                },
                {
                  label: "Total vCPUs",
                  value: "20",
                  sub: "allocated",
                  accent: "#60A5FA",
                },
                {
                  label: "Memory",
                  value: "120 GB",
                  sub: "in use",
                  accent: "#A78BFA",
                },
                {
                  label: "Est. Cost",
                  value: "$4.14",
                  sub: "/hour",
                  accent: "#FBBF24",
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#111114",
                    border: "1px solid #1E1E22",
                    borderRadius: 10,
                    padding: "18px 20px",
                    animation: `slideUp 0.4s ease ${i * 0.05}s both`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#71717A",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: stat.accent,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 12, color: "#52525B" }}>
                      {stat.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#A1A1AA",
                  }}
                >
                  Machines
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {vms.map((vm, i) => (
                    <div
                      key={vm.id}
                      onClick={() => setSelectedVM(i)}
                      style={{
                        background: selectedVM === i ? "#16161A" : "#111114",
                        border: `1px solid ${
                          selectedVM === i ? "#FF6B4A33" : "#1E1E22"
                        }`,
                        borderRadius: 10,
                        padding: "14px 18px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        animation: `slideUp 0.4s ease ${i * 0.06}s both`,
                        ...(selectedVM === i && {
                          boxShadow: "0 0 0 1px #FF6B4A22",
                        }),
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <StatusDot status={vm.status} />
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {vm.name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background:
                              vm.status === "running"
                                ? "#4ADE8015"
                                : vm.status === "provisioning"
                                  ? "#FBBF2415"
                                  : "#27272A",
                            color:
                              vm.status === "running"
                                ? "#4ADE80"
                                : vm.status === "provisioning"
                                  ? "#FBBF24"
                                  : "#71717A",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {vm.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 11,
                          color: "#52525B",
                        }}
                      >
                        <span>
                          <span style={{ color: "#71717A" }}>Size:</span>{" "}
                          {vm.size}
                        </span>
                        <span>
                          <span style={{ color: "#71717A" }}>IP:</span> {vm.ip}
                        </span>
                        <span>
                          <span style={{ color: "#71717A" }}>Agent:</span>{" "}
                          {AGENTS.find((a) => a.id === vm.agent)?.icon}{" "}
                          {AGENTS.find((a) => a.id === vm.agent)?.name}
                        </span>
                      </div>
                      {vm.status === "running" && (
                        <div
                          style={{ display: "flex", gap: 12, marginTop: 10 }}
                        >
                          {[
                            {
                              label: "CPU",
                              val: vm.cpu,
                              color: vm.cpu > 80 ? "#EF4444" : "#4ADE80",
                            },
                            {
                              label: "MEM",
                              val: vm.mem,
                              color: vm.mem > 80 ? "#EF4444" : "#60A5FA",
                            },
                          ].map((m) => (
                            <div key={m.label} style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: 10,
                                  color: "#52525B",
                                  marginBottom: 4,
                                }}
                              >
                                <span>{m.label}</span>
                                <span
                                  style={{
                                    color: m.color,
                                    fontFamily: "'JetBrains Mono', monospace",
                                  }}
                                >
                                  {m.val}%
                                </span>
                              </div>
                              <div
                                style={{
                                  height: 3,
                                  background: "#1E1E22",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${m.val}%`,
                                    height: "100%",
                                    background: m.color,
                                    borderRadius: 2,
                                    transition: "width 0.6s ease",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#A1A1AA",
                    }}
                  >
                    Terminal —{" "}
                    <span style={{ color: "#FF6B4A" }}>{currentVm?.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => setScriptMode(false)}
                      style={{
                        background: !scriptMode ? "#27272A" : "transparent",
                        border: "1px solid #27272A",
                        color: !scriptMode ? "#F4F4F5" : "#52525B",
                        padding: "4px 10px",
                        borderRadius: 5,
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 500,
                      }}
                    >
                      Prompt
                    </button>
                    <button
                      onClick={() => setScriptMode(true)}
                      style={{
                        background: scriptMode ? "#27272A" : "transparent",
                        border: "1px solid #27272A",
                        color: scriptMode ? "#F4F4F5" : "#52525B",
                        padding: "4px 10px",
                        borderRadius: 5,
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 500,
                      }}
                    >
                      Script
                    </button>
                  </div>
                </div>

                <div
                  ref={termRef}
                  style={{
                    background: "#0C0C10",
                    border: "1px solid #1E1E22",
                    borderRadius: "10px 10px 0 0",
                    height: 260,
                    overflowY: "auto",
                    padding: 16,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    lineHeight: 1.7,
                  }}
                >
                  {terminalLines.length === 0 ? (
                    <div
                      style={{
                        color: "#3F3F46",
                        textAlign: "center",
                        paddingTop: 80,
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>⟡</div>
                      <div>
                        Send a natural language prompt to control this VM
                      </div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>
                        Agent: {currentAgent?.icon} {currentAgent?.name}
                      </div>
                    </div>
                  ) : (
                    terminalLines.map((line, i) => (
                      <div
                        key={`${line.type}-${i}`}
                        style={{
                          color:
                            line.type === "input"
                              ? "#FF6B4A"
                              : line.type === "agent"
                                ? "#A78BFA"
                                : line.type === "success"
                                  ? "#4ADE80"
                                  : line.type === "error"
                                    ? "#EF4444"
                                    : "#71717A",
                          animation: "fadeIn 0.2s ease",
                        }}
                      >
                        {line.type === "input" && (
                          <span style={{ color: "#52525B" }}>❯ </span>
                        )}
                        {line.text}
                      </div>
                    ))
                  )}
                  {isExecuting && (
                    <span
                      style={{
                        color: "#FBBF24",
                        animation: "termBlink 0.8s infinite",
                      }}
                    >
                      ▊
                    </span>
                  )}
                </div>

                {!scriptMode ? (
                  <div
                    style={{
                      background: "#111114",
                      border: "1px solid #1E1E22",
                      borderTop: "none",
                      borderRadius: "0 0 10px 10px",
                      padding: "12px 16px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: `${currentAgent?.color ?? "#A78BFA"}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {currentAgent?.icon}
                      </div>
                      <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && prompt.trim()) {
                            simulateExecution(prompt);
                            setPrompt("");
                          }
                        }}
                        placeholder="Describe what you want to do in plain English..."
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "#E4E4E7",
                          fontSize: 13,
                          fontFamily: "inherit",
                        }}
                      />
                      <button
                        onClick={() => {
                          if (prompt.trim()) {
                            simulateExecution(prompt);
                            setPrompt("");
                          }
                        }}
                        disabled={isExecuting || !prompt.trim()}
                        style={{
                          background: prompt.trim() ? "#FF6B4A" : "#27272A",
                          border: "none",
                          color: "#fff",
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          cursor: prompt.trim() ? "pointer" : "default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          transition: "all 0.15s",
                          flexShrink: 0,
                        }}
                      >
                        →
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      {SAMPLE_PROMPTS.slice(0, 3).map((p, i) => (
                        <button
                          key={`${p}-${i}`}
                          onClick={() => setPrompt(p)}
                          style={{
                            background: "#1A1A1E",
                            border: "1px solid #27272A",
                            borderRadius: 5,
                            color: "#71717A",
                            fontSize: 10,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                        >
                          {p.length > 44 ? `${p.slice(0, 44)}…` : p}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#111114",
                      border: "1px solid #1E1E22",
                      borderTop: "none",
                      borderRadius: "0 0 10px 10px",
                      padding: 0,
                    }}
                  >
                    <textarea
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      style={{
                        width: "100%",
                        height: 140,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#A1A1AA",
                        fontSize: 12,
                        padding: 16,
                        resize: "none",
                        fontFamily: "'JetBrains Mono', monospace",
                        lineHeight: 1.6,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "8px 12px",
                        borderTop: "1px solid #1E1E22",
                      }}
                    >
                      <button
                        style={{
                          background: "#4ADE80",
                          border: "none",
                          color: "#000",
                          padding: "6px 16px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ▶ Run Script
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showNewVM && (
          <div style={{ animation: "slideUp 0.35s ease", maxWidth: 860 }}>
            <button
              onClick={() => router.push("/dashboard?workspace=dashboard")}
              style={{
                background: "none",
                border: "none",
                color: "#71717A",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Back to Dashboard
            </button>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Launch New Machine
            </h2>
            <p style={{ color: "#52525B", fontSize: 13, marginBottom: 28 }}>
              Configure your VM specs, select an AI agent, and deploy
            </p>

            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#FF6B4A",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                01 — Identity
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color: "#71717A",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Machine Name
                  </label>
                  <input
                    value={vmName}
                    onChange={(e) => setVmName(e.target.value)}
                    placeholder="e.g. prod-api-02"
                    style={{
                      width: "100%",
                      background: "#111114",
                      border: "1px solid #27272A",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#E4E4E7",
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color: "#71717A",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Region
                  </label>
                  <select
                    style={{
                      width: "100%",
                      background: "#111114",
                      border: "1px solid #27272A",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#E4E4E7",
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  >
                    <option>East US</option>
                    <option>West US 2</option>
                    <option>Central US</option>
                    <option>North Europe</option>
                    <option>West Europe</option>
                    <option>Southeast Asia</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#FF6B4A",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                02 — VM Size (Azure)
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[
                  "All",
                  "Burstable",
                  "General",
                  "Compute",
                  "Memory",
                  "GPU",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t as "All" | VmTier)}
                    style={{
                      background: tierFilter === t ? "#27272A" : "transparent",
                      border: "1px solid #27272A",
                      color: tierFilter === t ? "#F4F4F5" : "#52525B",
                      padding: "4px 12px",
                      borderRadius: 5,
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                {filteredSizes.map((size) => (
                  <div
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    style={{
                      background:
                        selectedSize === size.name ? "#16161A" : "#111114",
                      border: `1px solid ${
                        selectedSize === size.name ? "#FF6B4A55" : "#1E1E22"
                      }`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      ...(selectedSize === size.name && {
                        boxShadow: "0 0 0 1px #FF6B4A33",
                      }),
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {size.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: "#27272A",
                          color: "#71717A",
                        }}
                      >
                        {size.tier}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 4,
                        fontSize: 10,
                        color: "#52525B",
                      }}
                    >
                      <div>
                        <span style={{ color: "#71717A" }}>{size.vcpu}</span>{" "}
                        vCPU
                      </div>
                      <div>
                        <span style={{ color: "#71717A" }}>{size.memory}</span>{" "}
                        GB
                      </div>
                      <div>
                        <span style={{ color: "#71717A" }}>{size.storage}</span>{" "}
                        GB
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#FBBF24",
                        marginTop: 8,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ${size.price}/hr
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#FF6B4A",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                03 — AI Agent
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 8,
                }}
              >
                {AGENTS.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setShowApiConfig(agent.id === "custom");
                    }}
                    style={{
                      background:
                        selectedAgent === agent.id ? "#16161A" : "#111114",
                      border: `1px solid ${
                        selectedAgent === agent.id
                          ? `${agent.color}55`
                          : "#1E1E22"
                      }`,
                      borderRadius: 8,
                      padding: "14px 12px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                      ...(selectedAgent === agent.id && {
                        boxShadow: `0 0 0 1px ${agent.color}33`,
                      }),
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>
                      {agent.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {agent.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#52525B",
                        lineHeight: 1.4,
                      }}
                    >
                      {agent.desc}
                    </div>
                  </div>
                ))}
              </div>

              {showApiConfig && (
                <div
                  style={{
                    marginTop: 12,
                    background: "#111114",
                    border: "1px solid #A78BFA33",
                    borderRadius: 8,
                    padding: 16,
                    animation: "slideUp 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#A78BFA",
                      marginBottom: 12,
                    }}
                  >
                    Custom API Configuration
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          color: "#71717A",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        API Endpoint
                      </label>
                      <input
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        placeholder="https://api.example.com/v1/chat"
                        style={{
                          width: "100%",
                          background: "#0C0C10",
                          border: "1px solid #27272A",
                          borderRadius: 6,
                          padding: "8px 12px",
                          color: "#E4E4E7",
                          fontSize: 12,
                          outline: "none",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 10,
                          color: "#71717A",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        style={{
                          width: "100%",
                          background: "#0C0C10",
                          border: "1px solid #27272A",
                          borderRadius: 6,
                          padding: "8px 12px",
                          color: "#E4E4E7",
                          fontSize: 12,
                          outline: "none",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              style={{
                background: "linear-gradient(135deg, #FF6B4A, #E8553A)",
                border: "none",
                color: "#fff",
                padding: "12px 32px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 0 30px rgba(255,107,74,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              ⟡ Deploy Machine
            </button>
          </div>
        )}

        {activeTab === "scripts" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Automation Scripts
            </h2>
            <p style={{ color: "#52525B", fontSize: 13, marginBottom: 24 }}>
              Write, save, and schedule automation scripts for your machines
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#A1A1AA",
                    marginBottom: 10,
                  }}
                >
                  Saved Scripts
                </div>
                {[
                  "setup-nginx.py",
                  "backup-daily.py",
                  "monitor-health.py",
                  "deploy-app.py",
                ].map((s, i) => (
                  <div
                    key={s}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: "pointer",
                      background: i === 0 ? "#18181B" : "transparent",
                      color: i === 0 ? "#F4F4F5" : "#71717A",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#52525B" }}>📄</span> {s}
                  </div>
                ))}
                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 6,
                    fontSize: 11,
                    background: "transparent",
                    border: "1px dashed #27272A",
                    color: "#52525B",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    marginTop: 8,
                  }}
                >
                  + New Script
                </button>
              </div>
              <div
                style={{
                  background: "#0C0C10",
                  border: "1px solid #1E1E22",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom: "1px solid #1E1E22",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: "#A1A1AA",
                    }}
                  >
                    setup-nginx.py
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      style={{
                        background: "#18181B",
                        border: "1px solid #27272A",
                        borderRadius: 5,
                        color: "#A1A1AA",
                        fontSize: 11,
                        padding: "4px 8px",
                        fontFamily: "inherit",
                      }}
                    >
                      <option>Target: prod-api-01</option>
                      <option>Target: ml-training-gpu</option>
                      <option>Target: All Running</option>
                    </select>
                    <button
                      style={{
                        background: "#4ADE80",
                        border: "none",
                        color: "#000",
                        padding: "4px 14px",
                        borderRadius: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ▶ Run
                    </button>
                  </div>
                </div>
                <textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  style={{
                    width: "100%",
                    height: 380,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#A1A1AA",
                    fontSize: 12,
                    padding: 16,
                    resize: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.7,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "machines" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                  All Machines
                </h2>
                <p style={{ color: "#52525B", fontSize: 13 }}>
                  Manage and monitor all your virtual machines
                </p>
              </div>
              <button
                onClick={() => {
                  router.push("/dashboard?workspace=launch");
                }}
                style={{
                  background: "linear-gradient(135deg, #FF6B4A, #E8553A)",
                  border: "none",
                  color: "#fff",
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + New Machine
              </button>
            </div>
            <div
              style={{
                background: "#111114",
                border: "1px solid #1E1E22",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 100px",
                  padding: "10px 18px",
                  borderBottom: "1px solid #1E1E22",
                  fontSize: 10,
                  color: "#52525B",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <span>Name</span>
                <span>Size</span>
                <span>Region</span>
                <span>Agent</span>
                <span>CPU</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {vms.map((vm, i) => (
                <div
                  key={vm.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 100px",
                    padding: "14px 18px",
                    borderBottom: "1px solid #1E1E22",
                    alignItems: "center",
                    fontSize: 12,
                    animation: `slideUp 0.3s ease ${i * 0.05}s both`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <StatusDot status={vm.status} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 500,
                      }}
                    >
                      {vm.name}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "#71717A",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                    }}
                  >
                    {vm.size}
                  </span>
                  <span style={{ color: "#71717A" }}>{vm.region}</span>
                  <span>
                    {AGENTS.find((a) => a.id === vm.agent)?.icon}{" "}
                    {AGENTS.find((a) => a.id === vm.agent)?.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: vm.cpu > 80 ? "#EF4444" : "#71717A",
                    }}
                  >
                    {vm.cpu}%
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 4,
                      width: "fit-content",
                      background:
                        vm.status === "running"
                          ? "#4ADE8015"
                          : vm.status === "provisioning"
                            ? "#FBBF2415"
                            : "#27272A",
                      color:
                        vm.status === "running"
                          ? "#4ADE80"
                          : vm.status === "provisioning"
                            ? "#FBBF24"
                            : "#71717A",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {vm.status}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["⟡", "■", "⟳"].map((a, j) => (
                      <button
                        key={`${vm.id}-${a}-${j}`}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 5,
                          border: "1px solid #27272A",
                          background: "transparent",
                          color: "#71717A",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 640 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
              Settings
            </h2>
            <p style={{ color: "#52525B", fontSize: 13, marginBottom: 28 }}>
              API keys, agent configurations, and account settings
            </p>

            {[
              {
                title: "API Keys",
                items: [
                  {
                    label: "OpenAI",
                    value: "sk-proj-...Xk4a",
                    connected: true,
                  },
                  {
                    label: "Anthropic",
                    value: "sk-ant-...9f2b",
                    connected: true,
                  },
                  {
                    label: "Custom Endpoint",
                    value: "Not configured",
                    connected: false,
                  },
                ],
              },
              { title: "Default Agent", items: [] },
            ].map((section, i) => (
              <div key={`${section.title}-${i}`} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#FF6B4A",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 12,
                  }}
                >
                  {section.title}
                </div>
                {section.items.map((item, j) => (
                  <div
                    key={`${item.label}-${j}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "#111114",
                      border: "1px solid #1E1E22",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#52525B",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 5,
                        fontSize: 11,
                        background: item.connected ? "#4ADE8015" : "#27272A",
                        color: item.connected ? "#4ADE80" : "#71717A",
                        fontWeight: 600,
                      }}
                    >
                      {item.connected ? "Connected" : "Configure"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
