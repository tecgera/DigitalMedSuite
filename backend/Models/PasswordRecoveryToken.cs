using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class PasswordRecoveryToken
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public Guid Token { get; set; }
        
        [Required]
        public int UsuarioId { get; set; }
        
        [ForeignKey("UsuarioId")]
        public Usuario Usuario { get; set; }
        
        [Required]
        public DateTime ExpirationDate { get; set; }
        
        public bool Used { get; set; }
        
        public DateTime? UsedDate { get; set; }
    }
}