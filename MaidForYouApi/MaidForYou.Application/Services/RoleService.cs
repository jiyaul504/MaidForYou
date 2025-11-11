using MaidForYou.Application.Common.Models;
using MaidForYou.Application.Interfaces;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<IEnumerable<Role>>> GetAllAsync()
        {
            var roles = await _unitOfWork.Roles.GetAllAsync();
            return ApiResponse<IEnumerable<Role>>.SuccessResponse(roles);
        }

        public async Task<ApiResponse<Role>> GetByIdAsync(int id)
        {
            var role = await _unitOfWork.Roles.GetByIdAsync(id);
            return role != null
                ? ApiResponse<Role>.SuccessResponse(role)
                : ApiResponse<Role>.FailureResponse("Role not found.");
        }

        public async Task<ApiResponse<Role>> CreateAsync(Role role)
        {
            var existing = await _unitOfWork.Roles.GetByNameAsync(role.Name);
            if (existing != null)
                return ApiResponse<Role>.FailureResponse("Role already exists.");

            var roleId = await _unitOfWork.Roles.AddAsync(role);

            await _unitOfWork.CommitAsync();

            role.Id = roleId;
            return ApiResponse<Role>.SuccessResponse(role, "Role created successfully.");
        }

        public async Task<ApiResponse<Role>> UpdateAsync(Role role)
        {
            var existing = await _unitOfWork.Roles.GetByIdAsync(role.Id);
            if (existing == null)
                return ApiResponse<Role>.FailureResponse("Role not found.");

            var updated = await _unitOfWork.Roles.UpdateAsync(role);
            if (!updated)
                return ApiResponse<Role>.FailureResponse("Failed to update role.");

            await _unitOfWork.CommitAsync();

            return ApiResponse<Role>.SuccessResponse(role, "Role updated successfully.");
        }

        public async Task<ApiResponse<string>> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Roles.GetByIdAsync(id);
            if (existing == null)
                return ApiResponse<string>.FailureResponse("Role not found.");

            var deleted = await _unitOfWork.Roles.DeleteAsync(id);
            if (!deleted)
                return ApiResponse<string>.FailureResponse("Failed to delete role.");

            await _unitOfWork.CommitAsync();

            return ApiResponse<string>.SuccessResponse("Role deleted successfully.");
        }
    }
}
