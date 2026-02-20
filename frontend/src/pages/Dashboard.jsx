import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTasksAPI } from "../services/auth";
import Loader from "../components/Loader";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/40 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color} bg-current/10`} style={{ background: "rgba(255,255,255,0.05)" }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasksAPI()
      .then((res) => setTasks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  const recentTasks = tasks.slice(0, 5);

  const statusStyle = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">
            {greeting()}, <span className="text-[#1368EC]">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">Here's what's happening with your tasks today.</p>
        </div>
        <Link
          to="/tasks"
          className="flex items-center gap-2 bg-[#1368EC] hover:bg-[#0f57c8] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-[#1368EC]/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Link>
      </div>

      {/* Stats */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Tasks" value={total} color="text-white" icon="📋" />
          <StatCard label="Completed" value={completed} color="text-emerald-400" icon="✅" />
          <StatCard label="In Progress" value={inProgress} color="text-blue-400" icon="🔄" />
          <StatCard label="Pending" value={pending} color="text-amber-400" icon="⏳" />
        </div>
      )}

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-sm font-medium">Overall Progress</p>
            <p className="text-white/40 text-sm">{Math.round((completed / total) * 100)}%</p>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1368EC] to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <p className="text-white/30 text-xs mt-2">{completed} of {total} tasks completed</p>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Tasks</h2>
          <Link to="/tasks" className="text-[#1368EC] hover:text-[#4a90e2] text-sm transition-colors">
            View all →
          </Link>
        </div>

        {loading ? <Loader /> : recentTasks.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-white/40 text-sm">No tasks yet. Create your first task!</p>
            <Link to="/tasks" className="inline-flex mt-4 bg-[#1368EC]/10 text-[#1368EC] border border-[#1368EC]/20 px-4 py-2 rounded-xl text-sm hover:bg-[#1368EC]/20 transition-all">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task._id} className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between hover:border-white/15 transition-all group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-emerald-400" : task.status === "in-progress" ? "bg-blue-400" : "bg-amber-400"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === "completed" ? "text-white/40 line-through" : "text-white"}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-white/30 text-xs truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                </div>
                <span className={`flex-shrink-0 ml-4 text-xs px-2.5 py-1 rounded-lg border capitalize ${statusStyle[task.status] || statusStyle.pending}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;