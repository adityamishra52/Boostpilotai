import { Inbox, MessageSquare, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SectionContainer from "../../components/SectionContainer";
import { contactService } from "../../services/contactService";
import { supportService } from "../../services/supportService";

const ticketStatuses = ["all", "open", "in_progress", "resolved", "closed"];
const feedbackStatuses = ["all", "new", "reviewing", "planned", "resolved", "closed"];
const categories = ["all", "Technical Issue", "Billing", "Feature Request", "Bug Report", "Account Problem", "General Question"];
const contactStatuses = ["all", "new", "read", "replied", "closed"];

const formatStatus = (status) => String(status || "").replace(/_/g, " ");

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [ticketStatus, setTicketStatus] = useState("all");
  const [ticketCategory, setTicketCategory] = useState("all");
  const [feedbackStatus, setFeedbackStatus] = useState("all");
  const [contactStatus, setContactStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [ticketData, feedbackData, contactData] = await Promise.all([
        supportService.adminTickets({
          ...(ticketStatus !== "all" ? { status: ticketStatus } : {}),
          ...(ticketCategory !== "all" ? { category: ticketCategory } : {})
        }),
        supportService.adminFeedback(feedbackStatus !== "all" ? { status: feedbackStatus } : {}),
        contactService.adminMessages(contactStatus !== "all" ? { status: contactStatus } : {})
      ]);
      setTickets(ticketData.tickets || []);
      setFeedback(feedbackData.feedback || []);
      setContacts(contactData.messages || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load support inbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [ticketStatus, ticketCategory, feedbackStatus, contactStatus]);

  const totals = useMemo(
    () => ({
      openTickets: tickets.filter((item) => item.status === "open").length,
      urgentTickets: tickets.filter((item) => item.priority === "Urgent").length,
      newFeedback: feedback.filter((item) => item.status === "new").length,
      newContacts: contacts.filter((item) => item.status === "new").length
    }),
    [contacts, feedback, tickets]
  );

  const changeTicketStatus = async (id, status) => {
    try {
      const data = await supportService.updateTicketStatus(id, status);
      setTickets((current) => current.map((item) => (item._id === id ? { ...item, status: data.ticket.status } : item)));
      toast.success("Ticket status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update ticket");
    }
  };

  const changeContactStatus = async (id, status) => {
    try {
      const data = await contactService.updateStatus(id, status);
      setContacts((current) => current.map((item) => (item._id === id ? { ...item, status: data.message.status } : item)));
      toast.success("Contact status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update contact message");
    }
  };

  const changeFeedbackStatus = async (id, status) => {
    try {
      const data = await supportService.updateFeedbackStatus(id, status);
      setFeedback((current) => current.map((item) => (item._id === id ? { ...item, status: data.feedback.status } : item)));
      toast.success("Feedback status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update feedback");
    }
  };

  return (
    <div>
      <PageHeader
        action={<Button icon={RefreshCw} loading={loading} onClick={load} variant="secondary">Refresh</Button>}
        description="Review creator support tickets, feedback requests, bug reports, and priority issues."
        eyebrow="Admin"
        title="Support inbox"
      />

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ["Open tickets", totals.openTickets],
          ["Urgent tickets", totals.urgentTickets],
          ["New feedback", totals.newFeedback],
          ["New contacts", totals.newContacts]
        ].map(([label, value]) => (
          <Card className="p-4" key={label}>
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-zinc-950 dark:text-white">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionContainer icon={Inbox} title="Support tickets" description="Filter by status and category.">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <select className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => setTicketStatus(event.target.value)} value={ticketStatus}>
              {ticketStatuses.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
            </select>
            <select className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => setTicketCategory(event.target.value)} value={ticketCategory}>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="grid gap-3">
            {tickets.map((ticket) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={ticket._id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">{ticket.category}</Badge>
                      <Badge variant={ticket.priority === "Urgent" ? "danger" : "brand"}>{ticket.priority}</Badge>
                      <Badge variant="neutral">{formatStatus(ticket.status)}</Badge>
                    </div>
                    <h3 className="mt-3 font-extrabold text-zinc-950 dark:text-white">{ticket.name}</h3>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{ticket.email}</p>
                  </div>
                  <select className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => changeTicketStatus(ticket._id, event.target.value)} value={ticket.status}>
                    {ticketStatuses.filter((item) => item !== "all").map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
                  </select>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">{ticket.message}</p>
                {ticket.attachmentUrl && <p className="mt-3 text-xs font-bold text-zinc-500 dark:text-zinc-400">Attachment: {ticket.attachmentUrl}</p>}
              </div>
            ))}
            {!tickets.length && <p className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">No tickets match the current filters.</p>}
          </div>
        </SectionContainer>

        <div className="grid gap-5">
          <SectionContainer icon={MessageSquare} title="Feedback requests" description="Feature requests, bugs, and improvement ideas.">
          <div className="mb-4">
            <select className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => setFeedbackStatus(event.target.value)} value={feedbackStatus}>
              {feedbackStatuses.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
            </select>
          </div>
          <div className="grid gap-3">
            {feedback.map((item) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={item._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="brand">{item.type}</Badge>
                      <Badge variant="neutral">{formatStatus(item.status)}</Badge>
                    </div>
                    <h3 className="mt-3 font-extrabold text-zinc-950 dark:text-white">{item.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">{item.message}</p>
                  </div>
                  <ShieldCheck className="shrink-0 text-brand-500" size={18} />
                </div>
                <select className="mt-3 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => changeFeedbackStatus(item._id, event.target.value)} value={item.status}>
                  {feedbackStatuses.filter((status) => status !== "all").map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}
                </select>
              </div>
            ))}
            {!feedback.length && <p className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">No feedback matches the current filters.</p>}
          </div>
          </SectionContainer>
          <SectionContainer icon={MessageSquare} title="Contact messages" description="Public contact page submissions.">
          <div className="mb-4">
            <select className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => setContactStatus(event.target.value)} value={contactStatus}>
              {contactStatuses.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
            </select>
          </div>
          <div className="grid gap-3">
            {contacts.map((item) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={item._id}>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="brand">{item.category}</Badge>
                  <Badge variant="neutral">{formatStatus(item.status)}</Badge>
                </div>
                <h3 className="mt-3 font-extrabold text-zinc-950 dark:text-white">{item.subject}</h3>
                <p className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">{item.name} - {item.email}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">{item.message}</p>
                <select className="mt-3 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" onChange={(event) => changeContactStatus(item._id, event.target.value)} value={item.status}>
                  {contactStatuses.filter((status) => status !== "all").map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}
                </select>
              </div>
            ))}
            {!contacts.length && <p className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">No contact messages match the current filters.</p>}
          </div>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
