// ==============================
// Interface cho bảng `users`
// ==============================
export interface User {
  id: string; // UUID, lấy từ auth.users
  full_name: string | null; // Tên đầy đủ, đồng bộ từ auth.users
  email: string; // Email người dùng, duy nhất
  role: 'admin' | 'user'; // Vai trò người dùng
  created_at: string; // Thời gian tạo tài khoản
}

// ==============================
// Interface cho bảng `events`
// ==============================
export interface Event {
  id: string; // UUID sự kiện
  name: string; // Tên sự kiện
  slogan?: string | null; // Khẩu hiệu
  description?: string | null; // Mô tả
  image_url?: string | null; // Link hình ảnh
  start_time: string; // Thời gian bắt đầu
  end_time: string; // Thời gian kết thúc
  status: 'draft' | 'open' | 'closed'; // Trạng thái sự kiện
  created_by?: string | null; // ID người tạo (User)
  created_at?: string; // Ngày tạo
}

// ==============================
// Interface cho bảng `criteria`
// ==============================
export interface Criteria {
  id: string; // UUID tiêu chí
  event_id?: string | null; // ID sự kiện áp dụng
  name: string; // Tên tiêu chí
  description?: string | null; // Mô tả tiêu chí
  weight?: number; // Trọng số (>= 0), mặc định = 1
  max_score?: number; // Điểm tối đa (> 0), mặc định = 10
}

// ==============================
// Interface cho bảng `criteria_scores`
// ==============================
export interface CriteriaScore {
  id: string; // UUID điểm tiêu chí
  judge_score_id?: string | null; // ID của bảng judge_scores
  criteria_id?: string | null; // ID tiêu chí
  score?: number | null; // Điểm số cho tiêu chí (>= 0)
}

// ==============================
// Interface cho bảng `ideas`
// ==============================
export interface Idea {
  id: string; // UUID ý tưởng
  event_id?: string | null; // Sự kiện liên quan
  user_id?: string | null; // Người tạo ý tưởng
  title: string; // Tiêu đề ý tưởng
  description?: string | null; // Mô tả ý tưởng
  status: 'pending' | 'approved' | 'rejected'; // Trạng thái phê duyệt
  created_at?: string; // Ngày tạo
}

// ==============================
// Interface cho bảng `teams`
// ==============================
export interface Team {
  id: string; // UUID đội nhóm
  event_id?: string | null; // Sự kiện tham gia
  name: string; // Tên nhóm
  status: 'pending' | 'approved' | 'rejected'; // Trạng thái xét duyệt
  created_at?: string; // Ngày tạo
}

// ==============================
// Interface cho bảng `team_members`
// ==============================
export interface TeamMember {
  id: string; // UUID thành viên nhóm
  team_id?: string | null; // ID nhóm
  user_id?: string | null; // ID người dùng
  role: 'leader' | 'member'; // Vai trò trong nhóm
}

// ==============================
// Interface cho bảng `projects`
// ==============================
export interface Project {
  id: string; // UUID dự án
  event_id?: string | null; // Sự kiện
  team_id?: string | null; // Nhóm thực hiện
  idea_id?: string | null; // Ý tưởng tham khảo
  scheduled_time: string; // Thời gian trình bày
  code_link?: string | null; // Link mã nguồn
  slide_link?: string | null; // Link slide thuyết trình
  demo_link?: string | null; // Link demo
  submitted_at?: string | null; // Thời gian nộp dự án
}

// ==============================
// Interface cho bảng `judges`
// ==============================
export interface Judge {
  id: string; // UUID giám khảo
  event_id?: string | null; // Sự kiện
  user_id?: string | null; // Liên kết với người dùng
}

// ==============================
// Interface cho bảng `judge_scores`
// ==============================
export interface JudgeScore {
  id: string; // UUID phiếu chấm điểm
  project_id?: string | null; // Dự án được chấm
  judge_id?: string | null; // Giám khảo
  submitted_at?: string | null; // Ngày chấm
  total_score?: number; // Tổng điểm, mặc định = 0
}