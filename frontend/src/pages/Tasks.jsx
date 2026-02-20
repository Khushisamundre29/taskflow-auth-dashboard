import { useEffect, useState, useRef } from "react";
import { getTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI } from "../services/auth";
import Loader from "../components/Loader";

const statusStyle = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const EMPTY_FORM = { title: "", description: "", status: "pending" };

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

// Custom dark-themed dropdown — avoids browser native white bg
const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = STATUS_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-2.5 py-1.5 hover:border-white/20 hover:text-white transition-all"
      >
        {current?.label}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-[#0d0d14] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[130px]">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-all hover:bg-white/5 flex items-center gap-2 ${
                opt.value === value ? "text-[#1368EC]" : "text-white/60 hover:text-white"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${opt.value === "completed" ? "bg-emerald-400" : opt.value === "in-progress" ? "bg-blue-400" : "bg-amber-400"}`} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasksAPI();
      setTasks(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    return e;
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setFormErrors({}); setShowModal(true); };
  const openEdit = (task) => { setForm({ title: task.title, description: task.description || "", status: task.status }); setEditId(task._id); setFormErrors({}); setShowModal(true); };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await updateTaskAPI(editId, form);
        setTasks((prev) => prev.map((t) => t._id === editId ? res.data : t));
      } else {
        const res = await createTaskAPI(form);
        setTasks((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskAPI(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {}
    setDeleteId(null);
  };

  const filtered = tasks
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Tasks</h1>
          <p className="text-white/40 text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1368EC] hover:bg-[#0f57c8] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-[#1368EC]/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/20 text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 focus:border-[#1368EC]/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "in-progress", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium capitalize transition-all border ${
                filterStatus === s
                  ? "bg-[#1368EC]/15 text-[#1368EC] border-[#1368EC]/30"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-3">{search || filterStatus !== "all" ? "🔍" : "📝"}</div>
          <p className="text-white/40 text-sm">
            {search || filterStatus !== "all" ? "No tasks match your search." : "No tasks yet. Create your first!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <div key={task._id} className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-all group">
              {/* Status dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-emerald-400" : task.status === "in-progress" ? "bg-blue-400" : "bg-amber-400"}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${task.status === "completed" ? "line-through text-white/30" : "text-white"}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-white/30 text-xs mt-0.5 truncate">{task.description}</p>
                )}
              </div>

              {/* Status badge */}
              <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-lg border capitalize ${statusStyle[task.status] || statusStyle.pending}`}>
                {task.status}
              </span>

              {/* Quick status toggle - custom dropdown */}
              <StatusDropdown
                value={task.status}
                onChange={async (val) => {
                  const res = await updateTaskAPI(task._id, { ...task, status: val });
                  setTasks((prev) => prev.map((t) => t._id === task._id ? res.data : t));
                }}
              />

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(task)}
                  className="p-2 text-white/40 hover:text-[#1368EC] hover:bg-[#1368EC]/10 rounded-lg transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(task._id)}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0d0d14] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-white font-semibold text-lg mb-5">{editId ? "Edit Task" : "New Task"}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all ${formErrors.title ? "border-red-500/50" : "border-white/10"}`}
                />
                {formErrors.title && <p className="mt-1 text-red-400 text-xs">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1368EC] hover:bg-[#0f57c8] text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {editId ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[#0d0d14] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">Delete Task?</h3>
            <p className="text-white/40 text-sm mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;