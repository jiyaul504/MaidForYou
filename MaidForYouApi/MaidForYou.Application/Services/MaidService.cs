using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Domain.Entities;
using MaidForYou.Domain.ValueObjects;

namespace MaidForYou.Application.Services
{
    public class MaidService : IMaidService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MaidService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<MaidDto?>> GetMaidByIdAsync(int id)
        {
            var maidResponse = await _unitOfWork.Maids.GetByIdAsync(id);
            if (!maidResponse.Success || maidResponse.Data == null)
                return ApiResponse<MaidDto?>.FailureResponse("Maid not found.");

            var dto = new MaidDto
            {
                Id = maidResponse.Data.Id,
                FullName = maidResponse.Data.FullName,
                Email = maidResponse.Data.Email,
                Phone = maidResponse.Data.Phone,
                Experience = maidResponse.Data.Experience,
                IsAvailable = maidResponse.Data.IsAvailable
            };

            return ApiResponse<MaidDto?>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<IEnumerable<MaidDto>>> GetAvailableMaidsAsync()
        {
            var maidsResponse = await _unitOfWork.Maids.GetAvailableAsync();
            if (!maidsResponse.Success || maidsResponse.Data == null)
                return ApiResponse<IEnumerable<MaidDto>>.FailureResponse(maidsResponse.Message ?? "Failed to load maids.");

            var dtos = maidsResponse.Data.Select(m => new MaidDto
            {
                Id = m.Id,
                FullName = m.FullName,
                Email = m.Email,
                Phone = m.Phone,
                Experience = m.Experience,
                IsAvailable = m.IsAvailable
            });

            return ApiResponse<IEnumerable<MaidDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<MaidDto>> RegisterMaidAsync(MaidDto maidDto)
        {
            var maid = new Maid
            {
                FullName = maidDto.FullName,
                Email = maidDto.Email,
                Phone = maidDto.Phone,
                Experience = maidDto.Experience,
                IsAvailable = maidDto.IsAvailable,
                CreatedAt = DateTime.UtcNow,
                Address = new Address(
                    maidDto.Address?.Street ?? string.Empty,
                    maidDto.Address?.City ?? string.Empty,
                    maidDto.Address?.State ?? string.Empty,
                    maidDto.Address?.ZipCode ?? string.Empty
                )
            };

            var addResponse = await _unitOfWork.Maids.AddAsync(maid);
            if (!addResponse.Success)
                return ApiResponse<MaidDto>.FailureResponse(addResponse.Message ?? "Failed to register maid.");

            await _unitOfWork.CommitAsync();

            var resultDto = new MaidDto
            {
                Id = addResponse.Data,
                FullName = maid.FullName,
                Email = maid.Email,
                Phone = maid.Phone,
                Experience = maid.Experience,
                IsAvailable = maid.IsAvailable
            };

            return ApiResponse<MaidDto>.SuccessResponse(resultDto, "Maid registered successfully.");
        }


        public async Task<ApiResponse<bool>> UpdateAvailabilityAsync(int maidId, bool isAvailable)
        {
            var maidResponse = await _unitOfWork.Maids.GetByIdAsync(maidId);
            if (!maidResponse.Success || maidResponse.Data == null)
                return ApiResponse<bool>.FailureResponse("Maid not found.");

            maidResponse.Data.IsAvailable = isAvailable;

            var updateResponse = await _unitOfWork.Maids.UpdateAsync(maidResponse.Data);
            if (!updateResponse.Success)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<bool>.FailureResponse(updateResponse.Message ?? "Failed to update availability.");
            }

            await _unitOfWork.CommitAsync(); 
            return ApiResponse<bool>.SuccessResponse(true, "Availability updated successfully.");
        }

    }
}
