import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, MessageSquare, Shield, Bot, Users, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

interface DiscordInvite {
  code: string;
  guild: {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
  };
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

interface ServerData {
  invite: string;
  code: string;
  name: string;
  description: string;
  memberCount: number | null;
  onlineCount: number | null;
  loading: boolean;
  error: boolean;
  role: string;
  badges: string[];
  automations: string[];
}

const DiscordAutomation = () => {

  const experiences = [
    { server: "FleetMC", role: "Moderator", color: "from-blue-500 to-cyan-500" },
    { server: "FireMC", role: "Staff", color: "from-red-500 to-orange-500" },
    { server: "BattelPai", role: "Moderator", color: "from-purple-500 to-pink-500" },
    { server: "Creator", role: "10+ Discord Servers", color: "from-green-500 to-emerald-500" },
  ];

  const serverConfigs = [
    {
      code: "6GtfRUG7f8",
      invite: "https://discord.gg/6GtfRUG7f8",
      role: "Server Creator & Lead Moderator",
      defaultName: "Gaming Community Hub",
      defaultDesc: "Active gaming community with competitive events and engagement systems",
      badges: ["Automated Moderation", "Custom Bots", "Event Scheduler"],
      automations: [
        "Auto-moderation system with configurable word filters and spam detection",
        "Welcome flow with verification and role assignment",
        "Level/XP system with role rewards",
        "Event scheduling with automatic reminders",
        "Moderation logging with appeal system",
        "Anti-raid protection with configurable thresholds",
      ],
    },
    {
      code: "N7GSGYdhvg",
      invite: "https://discord.gg/N7GSGYdhvg",
      role: "Moderator & Automation Developer",
      defaultName: "Community & Events Server",
      defaultDesc: "Event-driven community server with automated scheduling and role management",
      badges: ["Reaction Roles", "Event Scheduler", "Custom Commands"],
      automations: [
        "Reaction role system for self-assignment",
        "Automated event announcements and reminders",
        "Custom command framework for moderation",
        "Welcome embeds with server rules",
        "Channel sync for cross-posting",
        "Ticket system for support requests",
      ],
    },
    {
      code: "fQ9WuSQcYF",
      invite: "https://discord.gg/fQ9WuSQcYF",
      role: "Staff Member & System Architect",
      defaultName: "Utility & Staff Systems",
      defaultDesc: "Staff-focused server with advanced moderation tools and automation",
      badges: ["Automated Moderation", "Channel Syncs", "Custom Bots"],
      automations: [
        "Staff notification system with priority levels",
        "Automated backup and logging system",
        "Cross-channel message syncing",
        "Member verification with CAPTCHA",
        "Auto-role based on activity",
        "Moderation dashboard with statistics",
      ],
    },
    {
      code: "Vnu47bq4",
      invite: "https://discord.gg/Vnu47bq4",
      role: "Moderator",
      defaultName: "Active Gaming Community",
      defaultDesc: "Dynamic gaming community with player engagement and competitive events",
      badges: ["Custom Bots", "Reaction Roles", "Automated Moderation"],
      automations: [
        "Tournament bracket automation",
        "Player ranking and leaderboard system",
        "Automated match scheduling",
        "Anti-cheat detection alerts",
        "Voice channel management automation",
        "Achievement system with role rewards",
      ],
    },
    {
      code: "yessmartypie",
      invite: "https://discord.gg/yessmartypie",
      role: "Server Creator",
      defaultName: "SmartPie Community",
      defaultDesc: "Tech-focused community with educational resources and collaborative projects",
      badges: ["Event Scheduler", "Custom Commands", "Channel Syncs"],
      automations: [
        "Resource categorization and auto-tagging",
        "Study group scheduling automation",
        "Code snippet sharing system",
        "Project showcase automation",
        "Collaborative event planning tools",
        "Automated resource updates",
      ],
    },
    {
      code: "SKz5Qc3r",
      invite: "https://discord.gg/SKz5Qc3r",
      role: "Moderator & Bot Developer",
      defaultName: "Community Server",
      defaultDesc: "General purpose community with comprehensive moderation and engagement",
      badges: ["Automated Moderation", "Reaction Roles", "Event Scheduler"],
      automations: [
        "Multi-level moderation system",
        "Automated content filtering",
        "Member onboarding flow",
        "Community polls and voting system",
        "Birthday celebration automation",
        "Activity-based role progression",
      ],
    },
  ];

  const [servers, setServers] = useState<ServerData[]>(
    serverConfigs.map((config) => ({
      ...config,
      name: config.defaultName,
      description: config.defaultDesc,
      memberCount: null,
      onlineCount: null,
      loading: true,
      error: false,
    }))
  );

  useEffect(() => {
    const fetchServerData = async () => {
      const updatedServers = await Promise.all(
        serverConfigs.map(async (config) => {
          try {
            const response = await fetch(
              `https://discord.com/api/v10/invites/${config.code}?with_counts=true`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) {
              throw new Error('Failed to fetch');
            }

            const data: DiscordInvite = await response.json();

            return {
              ...config,
              name: data.guild?.name || config.defaultName,
              description: data.guild?.description || config.defaultDesc,
              memberCount: data.approximate_member_count || null,
              onlineCount: data.approximate_presence_count || null,
              loading: false,
              error: false,
            };
          } catch (error) {
            console.error(`Failed to fetch data for ${config.code}:`, error);
            return {
              ...config,
              name: config.defaultName,
              description: config.defaultDesc,
              memberCount: null,
              onlineCount: null,
              loading: false,
              error: true,
            };
          }
        })
      );

      setServers(updatedServers);
    };

    fetchServerData();
  }, []);

  const copyInvite = (invite: string, serverName: string) => {
    navigator.clipboard.writeText(invite);
    toast.success(`${serverName} invite copied!`);
  };

  const openDiscord = (invite: string) => {
    window.open(invite, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card animate-fade-in">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
          <a href="https://discord.gg/6CdCgjsVua" target="_blank" rel="noopener noreferrer">
            <Button variant="neon" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Me
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12 animate-slide-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Discord Automation</span>
              <br />
              <span className="text-foreground">& Server Work</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Moderation, automation, and server systems built & managed by <span className="text-primary font-semibold">Jagmohan</span>
            </p>
            <p className="text-sm text-muted-foreground">
              FleetMC (Moderator) • FireMC (Staff) • BattelPai (Moderator) • Creator of 10+ servers
            </p>
          </div>

          {/* Experience Strip */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-full px-6 py-3 hover:border-primary transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`}></div>
                <div className="relative flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{exp.server}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-sm text-muted-foreground">{exp.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Server Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {servers.map((server, index) => (
              <Card
                key={server.code}
                className="group relative bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all duration-500 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                        {server.name}
                        {server.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      </CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {server.description}
                      </CardDescription>
                      
                      {/* Member Count */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="w-3 h-3 text-primary" />
                          <span className="font-medium text-foreground">
                            {server.loading ? (
                              "Loading..."
                            ) : server.error || server.memberCount === null ? (
                              "Members: Private"
                            ) : (
                              <>
                                {server.memberCount.toLocaleString()} members
                                {server.onlineCount && (
                                  <span className="text-muted-foreground">
                                    {" "}• {server.onlineCount.toLocaleString()} online
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Shield className="w-3 h-3" />
                        <span className="font-medium text-primary">{server.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {server.badges.map((badge, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="neon"
                      size="sm"
                      onClick={() => openDiscord(server.invite)}
                      className="flex-1 gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Server
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvite(server.invite, server.name)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>

                  {/* Expandable Automation Details */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="automation" className="border-border/50">
                      <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors py-3">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          View Automation Details
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-2">
                          <p className="text-xs text-muted-foreground mb-3 font-semibold">
                            Implemented Automation Features:
                          </p>
                          <ul className="space-y-2">
                            {server.automations.map((automation, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Bot className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                                <span>{automation}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Sample Commands:</p>
                            <div className="space-y-1">
                              <code className="text-xs bg-muted/50 px-2 py-1 rounded block">!warn @user [reason]</code>
                              <code className="text-xs bg-muted/50 px-2 py-1 rounded block">!event create [name] [date]</code>
                              <code className="text-xs bg-muted/50 px-2 py-1 rounded block">!autorole add @role [condition]</code>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3 gradient-text">
                Need Discord Automation?
              </h3>
              <p className="text-muted-foreground mb-6">
                I build custom moderation systems, automation bots, and community management tools for Discord servers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://discord.gg/6CdCgjsVua" target="_blank" rel="noopener noreferrer">
                  <Button variant="neon" size="lg" className="gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact on Discord
                  </Button>
                </a>
                <Link to="/">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Portfolio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DiscordAutomation;
